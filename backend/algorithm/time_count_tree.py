'''
best k time algorithm


def of "best time" = argmax ( sum( time_count * (minutes) )

1. minutes > min_time_required
2. each output is time interval that is sum of time interval of nodes


'''

'''
How algorithm works

def time_interval = (start_time, end_time)

1. build tree
    1) Input to root a time_interval
        If a new time_interval has been inputed, it has time_count of 1
        
    2) Input other nodes
        when inputting other nodes, the other node can have 3 relationship with the tree node
        (1) one time_interval contains the other
        (2) it overlaps
        (3) it does not intersect
        These 3 cases are held accordingly considering time_count by node_relationship()
        
        so node_relationship outputs [new_left)node, new_self_node, new_right_node]
        (new_self_node is not None)
        
        the new_left_node recursively inserted to the left node and as same for right
        the new_self_node becomes the self node
        
        
'''

'''
Tree input specification(Database integrity)

Assumes that for each person, the free time interval must not overlap

ex) 
person that has free time(start_time, end_time)  
(1, 3) and (2,4) must not exit in DB

'''


class TimeConstraintException(Exception):
    def __init__(self, msg):
        self.msg = "start should be earlier than end"

    def __str__(self):
        return self.msg


class TimeCountNode:

    def __init__(self, start, end, time_count=1):
        if start >= end:
            raise TimeConstraintException()
        self.start = start
        self.end = end
        self.time_count = time_count
        self.left = None
        self.right = None

    #finds out the relation
    def node_relationship(self, oth):
        new_left = None
        new_self = None
        new_right = None
        #new left is not None
        if oth.start < self.start:
            if oth.end > self.end:
                new_left = TimeCountNode(oth.start, self.start, oth.time_count)
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
                new_right = TimeCountNode(self.end, oth.end, oth.time_count)
            elif oth.end == self.end:
                new_left = TimeCountNode(oth.start, self.start, oth.time_count)
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
            else:
                # oth.end < self.end
                if oth.end > self.start:
                    new_left = TimeCountNode(oth.start, self.start, oth.time_count)
                    new_self = TimeCountNode(self.start, oth.end, self.time_count + oth.time_count)
                    new_right = TimeCountNode(oth.end, self.end, self.time_count)
                else:
                    new_left = TimeCountNode(oth.start, oth.end, oth.time_count)
                    new_self = TimeCountNode(self.start, self.end, self.time_count)

        elif oth.start == self.start:
            if oth.end > self.end:
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
                new_right = TimeCountNode(self.end, oth.end, oth.time_count)
            elif oth.end == self.end:
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
            else:
                new_self = TimeCountNode(self.start, oth.end, self.time_count + oth.time_count)
                new_right = TimeCountNode(oth.end, self.end, self.time_count)

        else:
            # oth.start > self.start

            if oth.end > self.end:
                if oth.start < self.end:
                    new_left = TimeCountNode(self.start, oth.start, self.time_count)
                    new_self = TimeCountNode(oth.start, self.end, self.time_count + oth.time_count)
                    new_right = TimeCountNode(self.end, oth.end, oth.time_count)

                else:
                    new_self = TimeCountNode(self.start, self.end, self.time_count)
                    new_right = TimeCountNode(oth.start, oth.end, oth.time_count)

            elif oth.end == self.end:
                new_left = TimeCountNode(self.start, oth.start, self.time_count)
                new_self = TimeCountNode(oth.start, oth.end, self.time_count + oth.time_count)

            else:
                new_left = TimeCountNode(self.start, oth.start, self.time_count)
                new_self = TimeCountNode(oth.start, oth.end, oth.time_count + self.time_count)
                new_right = TimeCountNode(oth.end, self.end, self.time_count)

        return [new_left, new_self, new_right]



    def insert_node(self, oth):
        [new_left, new_self, new_right] = self.node_relationship(oth)

        self.start = new_self.start
        self.end = new_self.end
        self.time_count = new_self.time_count

        if self.left is None:
            self.left = new_left
        else:
            self.left.insert_node(new_left)

        if self.right is None:
            self.right = new_right
        else:
            self.right.insert_node(new_right)

    def print_inorder(self):
        if self.left is not None:
            self.left.print_inorder()
        print("start: {}, end: {}, time count: {}".format(self.start, self.end, self.time_count))
        if self.right is not None:
            self.right.print_inorder()


class TimeCountTree:

    def __init__(self, node):
        self.root = node

    def insert(self, oth):
        self.root.insert_node(oth)

    def print_inorder(self):
        self.root.print_inorder()