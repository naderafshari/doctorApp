export interface Calendar {
  calId:        string;
  numOfSlots?:  number;
  slots?:       {};
  startTime?:   string;
  updateTime?:  string;
}
/*
export interface Slot {
  id:           string;
  description?: string;
  location:     string;
  subject?:     string;
  calendar:     string;
  start:        string;
  end:          string;
}
*/
export class DataClass {
  dataType = 'object';
  id = 'id';
  dataFields = [
    { name: 'id',           type: 'string' },
    { name: 'room',         type: 'string' },
    { name: 'therapist',    type: 'string' },
    { name: 'subject',      type: 'string' },
    { name: 'notes',        type: 'string' },
    { name: 'start',        type: 'date' },
    { name: 'end',          type: 'date' },
    { name: 'status',       type: 'string'}
  ];
}
