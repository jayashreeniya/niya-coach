import { LayoutAnimation, Platform } from 'react-native';

export function configureTransition(onConfigured = () => { }) {
  const animation = LayoutAnimation.create(
    750,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity,
  );

  const promise = new Promise(resolve => {
    if (Platform.OS === 'android') {
      LayoutAnimation.configureNext(animation);
      setTimeout(resolve as () => void, 750);
    } else {
      LayoutAnimation.configureNext(animation, resolve as () => void);
    }
  });

  onConfigured();

  return promise;
}

export function sleep(duration = 0) {
  return new Promise(resolve => {
    setTimeout(resolve as () => void, duration);
  });
}

export function clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}

export async function timeout(ms: number, f: Function) {
  const promise = f();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);

    promise.then(resolve, reject);
  });
}

export async function retry(count: number, f: Function): Promise<any> {
  if (count > 0) {
    try {
      return await f();
    } catch (e) {
      return retry(count - 1, f);
    }
  }

  return Promise.reject();
}

export async function invoke(options: any, f: Function) {
  return retry(options.retry || 1, () => timeout(options.timeout || 0, f));
}

const formatNumber = (number: number, pad = false) => {
  const numberString = number.toString();

  if (!pad) return numberString;

  return numberString.length < 2 ? `0${numberString}` : numberString;
};

export function formatElapsedTime(elapsed: number) {
  const seconds = elapsed % 60;
  const minutes = Math.floor((elapsed / 60) % 60);
  const hours = Math.floor(elapsed / 60 / 60);

  const parts = [
    hours > 0 && formatNumber(hours),
    (hours > 0 || minutes > 0) && formatNumber(minutes, hours > 0),
    formatNumber(seconds, hours > 0 || minutes > 0),
  ];

  return parts.filter(x => x !== false).join(':');
}