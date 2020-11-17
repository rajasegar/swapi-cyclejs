import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { makeDOMDriver, h1, div, p, nav, span, br,ul, li, a } from '@cycle/dom';
import { run } from '@cycle/run';
import { makeHashHistoryDriver } from '@cycle/history';
import { makeHTTPDriver } from '@cycle/http';


function navigation(pathname) {
  return nav([
    span({
      dataset: { page: 'home' },
      class: { 'active' : pathname === '/home' }
    }, 'Home'),
    span({
      dataset: { page: 'people' },
      class: { 'active' : pathname === '/people' }
    }, 'People'),
    span({
      dataset: { page: 'planets' },
      class: { 'active' : pathname === '/planets' }
    }, 'Planets')
  ]);
}

const getPeople$ = xs.of({
    url: 'https://swapi.dev/api/people/',
    category: 'people',
});

function homePage() {
  return div([
    h1('Home page')
  ]);
}

function peoplePage(http$) {
  const people$ = http$.select('people')
    .flatten()
    .map(res => res.body.results )
    .startWith(null);

  const peopleList = people$.map(people => people.map(p => p.name));

  return div([
    h1('People'),
    peopleList
  ]);
}

function planetsPage() {
  return div([
    h1('Planets')
  ]);
}

function view(history$, http$) {
  return history$.map(history => {
    const { pathname } = history;
    let page = h1('404 not found');

    if(pathname === '/home') {
      page = homePage();
    } else if(pathname === '/people') {
      page = peoplePage(http$);
    } else if(pathname === '/planets') {
      page = planetsPage();
    }

    return div([
      navigation(pathname),
      page,
      br()
    ]);

  });
}
function main(sources) {
  const history$ = sources.DOM.select('nav').events('click')
    .map(ev => ev.target.dataset.page)
    .startWith('home')
    .compose(dropRepeats());

  const vdom$ = view(sources.history, sources.HTTP); 

  return {
    DOM: vdom$,
    history: history$,
    HTTP: getPeople$
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
  history: makeHashHistoryDriver(),
  HTTP: makeHTTPDriver()
});
