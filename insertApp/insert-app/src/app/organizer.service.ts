import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  constructor(private webService: WebService) { }

  getOrganizer() {
    return this.webService.get('organizer')
  }

 createOrganizer(title: string) {
  return this.webService.post('organizer', { title })

 }

deleteOrganizer(id: string){
  return this.webService.delete(`organizer/${id}`)
}

}