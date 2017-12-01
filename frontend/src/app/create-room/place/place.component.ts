import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import {FormControl} from "@angular/forms";
import {MeetService} from "../../services/meet.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import {isUndefined} from "util";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public roomId: number;
  public roomHash: string;
  public place: google.maps.places.PlaceResult;
  public firstTimePlaceSetting: boolean;
  public  placeSelected: boolean;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private meetService: MeetService,
              private route: ActivatedRoute,
              private location: Location,
              private accountService: AccountService,
              private router: Router,
              private cdRef: ChangeDetectorRef) {
    this.route.params
      .flatMap(params => {
        this.roomHash = params['hash'];
        console.log(this.roomHash);
        return this.meetService.getRoomByHash(this.roomHash);
      })
      .subscribe(room => {
        this.roomId = room.id;
        accountService.getUserDetail().then(
          currUser => {
            if (currUser.id !== room.owner.id) {
              alert("Not allowed!\nNot owner of this room!");
              location.back();
            }
          }
        );
        if (room.latitude == null || room.longitude == null) {
          this.setCurrentPosition();
          this.firstTimePlaceSetting = true;
        }
        else {
          this.latitude = room.latitude;
          this.longitude = room.longitude;
          this.firstTimePlaceSetting = false;
         }
        this.placeSelected = false;
      });

  }

  ngOnInit() {
    //set google maps defaults
    this.zoom = 15;
    let options = {
      componentRestrictions: {country: 'kr'}
    };

    //create search FormControl
    this.searchControl = new FormControl();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              this.place = autocomplete.getPlace();


              //verify result
              if (this.place.geometry === undefined || this.place.geometry === null) {
                return;
              }
              this.placeSelected = true;
              this.cdRef.detectChanges();
              this.latitude = this.place.geometry.location.lat();
              this.longitude = this.place.geometry.location.lng();
            });
          });
        });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  private onSubmit(): void {
    this.zoom = 17;
    this.meetService.putPlace(this.roomId, this.place.name, this.latitude, this.longitude).then(
       isPutPlaceSuccess => {
        if (isPutPlaceSuccess) {
          if (this.firstTimePlaceSetting)
            this.router.navigate(['room', this.roomHash, 'time']);
          else
            this.router.navigate(['room', this.roomHash]);
        }
      }
    );
  }

  private goBack(): void {
    this.location.back();
  }

}