import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  loading$: Observable<boolean>;
  constructor(private spinnerService: SpinnerService) {
    this.loading$ = this.spinnerService.loading$;
  }


  ngOnInit(): void {
  }

}
