import { Component } from '@angular/core';

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [],
  templateUrl: './groups-page.component.html',
  styleUrl: './groups-page.component.css'
})
export class GroupsPageComponent {
constructor(){
  console.log("passato di qui");
};
}
