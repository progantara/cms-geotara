import { all, call, delay, put, takeLatest } from 'redux-saga/effects';
import { hideLoadingBar, setLoadingProgress, showLoadingBar } from '../store/actions/LoadingBarAction';

function* handleShowLoadingBar() {
  yield put(showLoadingBar());
}

function* handleHideLoadingBar() {
  yield put(hideLoadingBar());
}

function* handleLoadProgress({ payload }) {
  yield put(setLoadingProgress(payload));
}

function* handleRouteChange() {
  yield put(showLoadingBar());

  const interval = setInterval(() => {
    const progress = Math.random() * 10;
    const roundedProgress = Math.min(Math.ceil(progress), 100);
    const done = roundedProgress === 100;

    const result = {
      progress: roundedProgress,
      done,
    };

    if (done) {
      clearInterval(interval);
    }

    return result;
  }, 500);

  while (true) {
    const { progress, done } = yield call(interval);

    yield put(setLoadingProgress(progress));

    if (done) {
      yield put(hideLoadingBar());
      break;
    }
  }
}

function* rootSaga() {
  yield all([
    takeLatest('SHOW_LOADING_BAR', handleShowLoadingBar),
    takeLatest('HIDE_LOADING_BAR', handleHideLoadingBar),
    takeLatest('SET_LOADING_PROGRESS', handleLoadProgress),
    takeLatest('@@router/LOCATION_CHANGE', handleRouteChange),
  ]);
}

export default rootSaga;
