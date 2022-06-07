import { ConfigService } from './../../service/config.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  navigation = this.config.navigation;

  constructor(
    private config : ConfigService
  ) { }

  ngOnInit(): void {
  }

}
