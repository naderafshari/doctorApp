import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { jqxSchedulerComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscheduler';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Calendar, DataClass } from '../../model/calendar';
import * as _ from 'lodash';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit, AfterViewInit {
    uid: string;
    apnmt:  Observable<any>;
    appointment: any;
    usedSlots: any[];
    maxUsedSlot: any;
    minUsedSlot: any;
    dataAdapter: any;
    schedulerSettings: any;
    dataFieldsClass = new DataClass;
    source: any;
    sub: any;
    printButton: any = null;
   //these fields are predefined and cannot be changed
   appointmentDataFields: any = {
        from: 'start',
        to: 'end',
        id: 'id',
        description: 'status',
        location: 'room',
        subject: 'subject',
        resourceId: 'therapist',
    };

  @ViewChild("schedulerReference") scheduler: jqxSchedulerComponent;

  constructor(private afs: AngularFirestore, public authService: AuthService,
    private router: Router, private route: ActivatedRoute) {
    }

  ngAfterViewInit(): void 
  {
    //this.scheduler.createComponent(this.schedulerSettings);
    //this.scheduler.ensureAppointmentVisible("id1");
    this.uid = this.authService.currentUserId;
    if (this.uid) {
        this.apnmt = this.afs.doc(`appointment/${this.uid}`).valueChanges();
        this.sub = this.apnmt.subscribe( (apnmt) => {
            this.appointment = apnmt;
            this.dataFieldsClass = new DataClass;
            this.source = {
                dataType: this.dataFieldsClass.dataType,
                dataFields: this.dataFieldsClass.dataFields,
                id: this.dataFieldsClass.id,
                localData: apnmt.slots// this.generateAppointments()
            };
            this.dataAdapter = new jqx.dataAdapter(this.source);
            this.schedulerSettings = {
                date: new jqx.date(new Date().toString()), //(2018, 1, 23),
                width: 800,
                height: 600,
                source: this.dataAdapter,
                view: 'weekView',
                showLegend: true,
                appointmentDataFields: this.appointmentDataFields,
                editDialogCreate: this.editDialogCreate,
                editDialogOpen: this.editDialogOpen,
                editDialogClose: this.editDialogClose,
                resources:
                {
                    colorScheme: 'scheme05',
                    dataField: 'therapist',
                    source: new jqx.dataAdapter(this.source)
                },
                views:
                [
                    'dayView',
                    'weekView',
                    'monthView'
                ]
            };
            this.scheduler.createComponent(this.schedulerSettings);
            // this.scheduler.ensureAppointmentVisible('id1');

            const usedSlots = Object.keys(this.appointment.slots)
            .filter( slots => slots.charAt(0) === 's');
            this.usedSlots = usedSlots.map((x) => x.charAt(4) + x.charAt(5) + x.charAt(6));
            if (this.usedSlots.length) {
                this.usedSlots.sort((a, b) => {
                return (Number(a) > Number(b) ? 1 : (Number(b) > Number(a) ? -1 : 0));
                });
                this.maxUsedSlot = this.usedSlots.reduce((a, b) => {
                    return Math.max(Number(a), Number(b));
                });
                this.minUsedSlot = this.usedSlots.reduce((a, b) => {
                    return Math.min(Number(a), Number(b));
                });
            }
            // console.log(this.usedSlots);
        });
    }
  }
   
  generateAppointments(): any
  {
      let appointments = new Array();

      let appointment1 = {
          id: "id1", description: "George brings projector for presentations.", location: "", subject: "Quarterly Project Review Meeting", appointment: "Room 1",
          start: new Date(2018, 10, 23, 9, 0, 0), end: new Date(2018, 10, 23, 16, 0, 0)
      };
      let appointment2 = {
          id: "id2", description: "", location: "", subject: "IT Group Mtg.", appointment: "Room 2",
          start: new Date(2018, 10, 24, 10, 0, 0), end: new Date(2018, 10, 24, 15, 0, 0)
      };
      let appointment3 = {
          id: "id3", description: "", location: "", subject: "Course Social Media", appointment: "Room 3",
          start: new Date(2018, 10, 27, 11, 0, 0), end: new Date(2018, 10, 27, 13, 0, 0)
      };
      let appointment4 = {
          id: "id4", description: "", location: "", subject: "New Projects Planning", appointment: "Room 2",
          start: new Date(2018, 10, 23, 16, 0, 0), end: new Date(2018, 10, 23, 18, 0, 0)
      };
      let appointment5 = {
          id: "id5", description: "", location: "", subject: "Interview with James", appointment: "Room 1",
          start: new Date(2018, 10, 25, 15, 0, 0), end: new Date(2018, 10, 25, 17, 0, 0)
      };
      let appointment6 = {
          id: "id6", description: "", location: "", subject: "Interview with Nancy", appointment: "Room 4",
          start: new Date(2018, 10, 26, 14, 0, 0), end: new Date(2018, 10, 26, 16, 0, 0)
      };

      appointments.push(appointment1);
      appointments.push(appointment2);
      appointments.push(appointment3);
      appointments.push(appointment4);
      appointments.push(appointment5);
      appointments.push(appointment6);

      return appointments;
  }

 /*   source =
  {
      dataType: "array",
      dataFields: [
          { name: "id", type: "string" },
          { name: "description", type: "string" },
          { name: "location", type: "string" },
          { name: "subject", type: "string" },
          { name: "calendar", type: "string" },
          { name: "start", type: "date" },
          { name: "end", type: "date" }
      ],
      id: "id",
      localData: this.generateAppointments()
  }

  dataAdapter = new jqx.dataAdapter(this.source);
  printButton: any = null;
 */
  // called when the dialog is craeted.
  editDialogCreate = (dialog, fields, editAppointment) => {
    // hide repeat option
    fields.repeatContainer.hide();
    // hide status option
    fields.statusContainer.hide();
    // hide timeZone option
    fields.timeZoneContainer.hide();
    // hide color option
    fields.colorContainer.hide();
    fields.subjectLabel.html("Title");
    fields.locationLabel.html("Room");
    fields.fromLabel.html("Start");
    fields.toLabel.html("End");
    fields.resourceLabel.html("Therapist");
    // show resource option
    fields.resourceContainer.show();

    let buttonElement = document.createElement("BUTTON");
    buttonElement.innerText = 'Print';
    buttonElement.style.cssFloat = 'right';
    buttonElement.style.marginLeft = '5px';
    buttonElement.id = 'PrintButton';

    fields.buttons[0].appendChild(buttonElement);

    let printButton: jqwidgets.jqxButton = jqwidgets.createInstance('#PrintButton', 'jqxButton', {
        width: 50,
        height: 25
    });

    this.printButton = printButton;

    printButton.addEventHandler('click', function () {
        let appointment = editAppointment;
        if (!appointment && printButton.disabled) {
            return;
        }

        let appointmentContent =
            "<table class='printTable'>" +
            "<tr>" +
            "<td class='label'>Title</td>" +
            "<td>" + fields.subject.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>Start</td>" +
            "<td>" + fields.from.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>End</td>" +
            "<td>" + fields.to.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>Room</td>" +
            "<td>" + fields.location.val() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='label'>Therapist</td>" +
            "<td>" + fields.resource.val() + "</td>" +
            "</tr>"
            + "</table>";
        let newWindow = window.open('', '', 'width=800, height=500'),
            document = newWindow.document.open(),
            pageContent =
                '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<meta charset="utf-8" />\n' +
                '<title>jQWidgets Scheduler</title>\n' +
                '<style>\n' +
                '.printTable {\n' +
                'border-color: #aaa;\n' +
                '}\n' +
                '.printTable .label {\n' +
                'font-weight: bold;\n' +
                '}\n' +
                '.printTable td{\n' +
                'padding: 4px 3px;\n' +
                'border: 1px solid #DDD;\n' +
                'vertical-align: top;\n' +
                '}\n' +
                '</style>' +
                '</head>\n' +
                '<body>\n' + appointmentContent + '\n</body>\n</html>';
        try {
            document.write(pageContent);
            document.close();
        }
        catch (error) {
        }
        newWindow.print();
    });
    
  };

  /**
  * called when the dialog is opened. Returning true as a result disables the built-in handler.
  * @param {Object} dialog - jqxWindow's jQuery object.
  * @param {Object} fields - Object with all widgets inside the dialog.
  * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
  */
  editDialogOpen = (dialog, fields, editAppointment) => {
    if (!editAppointment && this.printButton) {
        this.printButton.setOptions({ disabled: false });
    }
    else if (editAppointment && this.printButton) {
        this.printButton.setOptions({ disabled: false });
    }
  };

  /**
  * called when the dialog is closed.
  * @param {Object} dialog - jqxWindow's jQuery object.
  * @param {Object} fields - Object with all widgets inside the dialog.
  * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
  */
  editDialogClose = (dialog, fields, editAppointment) => {
  };

  /**
  * called when a key is pressed while the dialog is on focus. Returning true or false as a result disables the built-in keyDown handler.
  * @param {Object} dialog - jqxWindow's jQuery object.
  * @param {Object} fields - Object with all widgets inside the dialog.
  * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
  * @param {jQuery.Event Object} the keyDown event.
  */
  editDialogKeyDown = (dialog, fields, editAppointment, event) => {
  };
/*   appointmentDataFields: any = {
    id: 'id',
    location: 'room',
    resource: 'therapist',
    subject: 'subject',
    notes: 'notes',
    from: 'start',
    to: 'end',
    style: 'style',
    status: 'status',
    };

  // schedulerSettings: jqwidgets.SchedulerOptions =
  schedulerSettings: any =
  {
    date: new jqx.date(2018, 10, 23),
      width: 800,
      height: 600,
      source: this.dataAdapter,
      view: "weekView",
      showLegend: true,
      appointmentDataFields: this.appointmentDataFields,
      editDialogCreate: this.editDialogCreate,
      editDialogOpen: this.editDialogOpen,
      editDialogClose: this.editDialogClose,
      resources:
      {
          colorScheme: "scheme05",
          dataField: "calendar",
          source: new jqx.dataAdapter(this.source)
      },
      views:
      [
          "dayView",
          "weekView",
          "monthView"
      ]
  };

*/
    private debounceAdd    =  _.debounce((slot) => this.addSlot(slot),    1500, {});
    private debounceDelete =  _.debounce((slot) => this.DeleteSlot(slot), 1500, {});
    private debounceChange =  _.debounce((slot) => this.ChangeSlot(slot), 1500, {});
    
    addSlot(slot) {
    const nextSlotId = `slot${this.nextAvailSlot(0, 'up')}`;
    this.appointment.slots[nextSlotId] = slot;
    this.appointment.numOfSlots++;
    this.appointment.updateTime = new Date().toString();
    this.appointment.startTime = new Date().toString();
    const aRef: AngularFirestoreDocument<any> = this.afs.doc(`appointment/${this.uid}`);
    aRef.update(this.appointment);
    }

    DeleteSlot(slot) {
        for (let i = 0; i < this.appointment.numOfSlots; i++) {
            const obj: Calendar = this.appointment.slots;
            if ( eval('obj.slot' + this.usedSlots[i] + '.id') === slot.id ) {
                    delete this.appointment.slots[`slot${this.usedSlots[i]}`];
                    this.appointment.numOfSlots--;
                    this.updateCalendar();
            }
        }
    }

    ChangeSlot(slot) {
        for (let i = 0; i < this.appointment.numOfSlots; i++) {
            const obj: Calendar = this.appointment.slots;
            if ( eval('obj.slot' + this.usedSlots[i] + '.id') === slot.id ) {
                    this.appointment.slots[`slot${this.usedSlots[i]}`] = slot;
                    this.updateCalendar();
            }
        }
    }

    updateCalendar() {
    this.appointment.updateTime = new Date().toString();
    const aRef: AngularFirestoreDocument<any> = this.afs.doc(`appointment/${this.uid}`);
    aRef.update(this.appointment);
    }

   onAppointmentDelete(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentDelete is raised');
      console.log(appointment.originalData);
        this.debounceDelete(appointment.originalData);
  };

  onAppointmentAdd(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentAdd is raised');
      console.log(appointment.originalData);
        this.debounceAdd(appointment.originalData);
  };

  onAppointmentDoubleClick(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentDoubleClick is raised');
      console.log(appointment.originalData);
  };

  onAppointmentChange(event: any): void {
      let appointment = event.args.appointment;
      console.log('appointmentChange is raised');
      console.log(appointment.originalData);
      this.debounceChange(appointment.originalData)
  };

  onCellClick(event: any): void {
      let cell = event.args.cell;
      console.log('cellClick is raised');
      console.log(cell);
  };

  nextAvailSlot(current, direction) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    for (let i = 0; i < this.usedSlots.length; i++) {
      if ( Number(this.usedSlots[i]) === next ) {
        return this.nextAvailSlot(next , direction );
      }
    }
    return next ;
  }

  nextUsedSlot(current, direction) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    if (next > this.maxUsedSlot || next < this.minUsedSlot) {
      return 'ERROR';
    } else {
      for (let i = 0; i < this.usedSlots.length; i++) {
        if ( Number(this.usedSlots[i]) === next ) {
          return next;
        }
      }
      return this.nextUsedSlot(next , direction );
    }
  }

  ngOnInit() {
  }

}
