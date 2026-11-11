import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowUndoOutline,
  barbellOutline,
  bodyOutline,
  calendarOutline,
  checkmarkCircle,
  chevronForward,
  fitnessOutline,
  flameOutline,
  swapHorizontalOutline,
  trophyOutline,
  walkOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      arrowUndoOutline,
      barbellOutline,
      bodyOutline,
      calendarOutline,
      checkmarkCircle,
      chevronForward,
      fitnessOutline,
      flameOutline,
      swapHorizontalOutline,
      trophyOutline,
      walkOutline,
    });
  }
}
