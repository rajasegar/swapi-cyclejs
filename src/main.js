import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { makeHashHistoryDriver } from '@cycle/history';
import { makeHTTPDriver } from '@cycle/http';
import Snabbdom from 'snabbdom-pragma';


function navigation(pathname) {
  return (
    <nav>
      <span data-page="home" class={{'active': pathname === '/home' }}>Home</span>
      <span data-page="people" class={{'active': pathname === '/people' }}>People</span>
      <span data-page="planets" class={{'active': pathname === '/planets' }}>Planets</span>
    </nav>
  );
}

const getPeople$ = xs.of({
    url: 'https://swapi.dev/api/people/',
    category: 'people',
});

function homePage() {
  return (
    <div>
      <h1>Star wars - swapi</h1>
    </div>
  );
}

function peoplePage(http$) {
  const people$ = http$.select('people')
    .flatten()
    .map(res => res.body.results )
    .startWith(null);

  const peopleList = people$.map(people => people.map(p => p.name));

  return (
    <div>
      <h1>People</h1>
        { peopleList }
    </div>
  );
}

function planetsPage() {
  return (
    <div>
      <h1>Planes</h1>
    </div>
  );
}

function view(history$, http$) {
  return history$.map(history => {
    const { pathname } = history;
    let page = <h1>404 not found</h1>;

    if(pathname === '/home') {
      page = homePage();
    } else if(pathname === '/people') {
      page = peoplePage(http$);
    } else if(pathname === '/planets') {
      page = planetsPage();
    }

    return (
      <div>
        {navigation(pathname)}
        {page}
        <br/>
      </div>
    );

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
