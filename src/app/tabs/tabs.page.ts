import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="today" href="/tabs/today">
          <ion-icon aria-hidden="true" name="barbell-outline"></ion-icon>
          <ion-label>Today</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="history" href="/tabs/history">
          <ion-icon aria-hidden="true" name="calendar-outline"></ion-icon>
          <ion-label>History</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {}
