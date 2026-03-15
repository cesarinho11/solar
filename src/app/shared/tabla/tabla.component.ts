import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
    @Input() scroll: boolean = false;

  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

    dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    ngOnInit() {
      console.log('data', this.data)
    this.displayedColumns = this.columns.map(c => c.key);

    if (this.actions.length > 0) {
      this.displayedColumns.push('acciones');
    }

    this.dataSource.data = this.data;

  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

    ngOnChanges(changes: SimpleChanges) {

    if (changes['data']) {
      console.log('Datos actualizados:', this.data);
      this.dataSource.data = this.data; // 🔥 ACTUALIZA LA TABLA
    }

  }


  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }


  // ngOnInit(): void {
  //   console.log('dataaa',this.data)
  //   console.log('columns',this.columns)
  // }

  // onAction(action: string, row: any) {
  //   this.actionClick.emit({ action, row });
  // }
}
