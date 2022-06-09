import { ConfigService } from 'src/app/service/config.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';
import { Observable, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  $list: Observable<User[]> = this.userService.getAll();
  cols: {key: string, label: string}[] = this.config.userColumns;

  constructor(
    private userService: UserService,
    private config: ConfigService
  ) {}

  ngOnInit(): void {}

  update(user: User): void {
    lastValueFrom(this.userService.update(user)).then((userResponse) => {
      console.log('User updated', userResponse);
    });
  }
}
