import _ from 'lodash';

/**
 * 过滤掉recoil自动生成的__withFallback后缀的节点
 */
export function getSnapshotWithoutFallback(snapshot: object) {
  return _.omitBy(snapshot, (val, key) => {
    return key.indexOf('__withFallback') !== -1;
  });
}
