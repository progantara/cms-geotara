import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import PostsReducer from "./reducers/PostsReducer";
import thunk from "redux-thunk";
import { AuthReducer } from "./reducers/AuthReducer";
import todoReducers from "./reducers/Reducers";
import { reducer as reduxFormReducer } from "redux-form";
import { LoadingBarReducer } from "./reducers/LoadingBarReducer";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../middleware/rootSaga";

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const middleware = [
    thunk,
    routerMiddleware(history),
    sagaMiddleware
];
const enhancers = [applyMiddleware(...middleware)];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    router: connectRouter(history),
	loadingBar: LoadingBarReducer,
	posts: PostsReducer,
	auth: AuthReducer,
	todoReducers,
	form: reduxFormReducer,
});

export const store = createStore(reducers, composeEnhancers(...enhancers));

sagaMiddleware.run(rootSaga);