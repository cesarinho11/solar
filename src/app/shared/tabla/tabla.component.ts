import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {

  constructor() { }
  
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Input() actions: { label: string; icon?: string; type: string; class?: string }[] = [];

  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

  ngOnInit(): void {
    console.log('dataaa',this.data)
    console.log('columns',this.columns)
  }

  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }
}
