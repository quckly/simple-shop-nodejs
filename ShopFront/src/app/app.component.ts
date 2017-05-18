import { Component, OnInit } from '@angular/core';
import { Router, RouterState, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    searchModel = { query: '' };

    constructor(private route: ActivatedRoute, private router: Router) { }

    public search() {
        const state: RouterState = this.router.routerState;
        const root: ActivatedRoute = state.root;

        //root.queryParams.subscribe(params => {
            let extParams = {};
            //Object.keys(params).forEach(key => {
            //    extParams[key] = params[key];
            //});
            extParams['query'] = this.searchModel.query;
            this.router.navigate(['/products'], { queryParams: extParams, queryParamsHandling: "merge" });
        //});
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['query']) {
                this.searchModel.query = params['query'];
            }
        });
    }
}
