import _ from 'lodash';
import { filteredSnapshot } from '../../types';

/**
 * 过滤掉recoil自动生成的__withFallback后缀的节点
 */
export function getSnapshotWithoutFallback(snapshot: filteredSnapshot) {
  return filterSnapshotByExcludeKeywords(snapshot, ['__withFallback'], true);
}

/**
 * 过滤出匹配关键词的节点
 * @param snapshot recoil数据切片
 * @param includeKeywords 关键词列表
 * @param parseDeps 是否修改依赖项数组
 * @returns 
 */
export function filterSnapshotByIncludeKeywords(snapshot: filteredSnapshot, includeKeywords: string[], parseDeps: boolean = false) {
  const newSnapshot: filteredSnapshot = {};
  _.forOwn(snapshot, (val, key) => {
    if (!isMatchKeyword(includeKeywords, key)) {
      return;
    }
    newSnapshot[key] = val;
    if (parseDeps) {
      const { nodeDeps, nodeToNodeSubscriptions, } = val;
      newSnapshot[key] = {
        ...val,
        nodeDeps: _.filter(nodeDeps, (node: string) => isMatchKeyword(includeKeywords, node)),
        nodeToNodeSubscriptions: _.filter(nodeToNodeSubscriptions, (node) => isMatchKeyword(includeKeywords, node)),
      };
    }
  });
  return newSnapshot;
}

/**
 * 将匹配关键字的节点排除
 * @param snapshot recoil数据切片
 * @param includeKeywords 关键词列表
 * @param parseDeps 是否修改依赖项数组
 * @returns 
 */
export function filterSnapshotByExcludeKeywords(snapshot: filteredSnapshot, excludeKeywords: string[], parseDeps: boolean = false) {
  const newSnapshot: filteredSnapshot = {};
  _.forOwn(snapshot, (val, key) => {
    if (isMatchKeyword(excludeKeywords, key)) {
      return;
    }
    newSnapshot[key] = val;
    if (parseDeps) {
      const { nodeDeps, nodeToNodeSubscriptions, } = val;
      newSnapshot[key] = {
        ...val,
        nodeDeps: _.filter(nodeDeps, (node: string) => !isMatchKeyword(excludeKeywords, node)),
        nodeToNodeSubscriptions: _.filter(nodeToNodeSubscriptions, (node) => !isMatchKeyword(excludeKeywords, node)),
      };
    }
  });
  return newSnapshot;
}

function isMatchKeyword(keywords: string[], targetText: string) {
  return keywords.some((keyword) => (targetText.toLowerCase()).indexOf(keyword.toLowerCase()) !== -1);
}
