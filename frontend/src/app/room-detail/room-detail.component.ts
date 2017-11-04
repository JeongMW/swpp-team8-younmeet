import { Component, OnInit } from '@angular/core';
import {Room} from "../models/room";
import {ActivatedRoute, Router} from "@angular/router";
import {MeetService} from "../services/meet.service";

import {User} from "../models/user";
import {AccountService} from "../services/account.service";
import {Timespan} from "../models/timespan";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/mergeMap"
import "rxjs/add/observable/forkJoin"

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styles: []
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  members: User[];
  availableTime: Timespan[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private meetService: MeetService) {
    this.route.params
      .flatMap(params => {
        let roomId = +params['id'];
        return this.meetService.getRoomById(roomId);
      })
      .flatMap(room => {
        this.room = room;
        let getMembers = this.meetService.getUsersInRoom(this.room.id)
          .then(members => this.members = members);
        let getAvailableTime = this.meetService.getAvailableTime(this.room.id)
          .then(availableTime => this.availableTime = availableTime);
        return Observable.forkJoin(getMembers, getAvailableTime);
      })
      .subscribe();
  }

  ngOnInit() {
  }

}