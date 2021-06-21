import { EdgeConfig, NodeConfig } from '@antv/g6';
import _ from 'lodash';
import React, { useEffect, useState, useCallback } from 'react';
import { filteredSnapshot, node } from '../../../types';
import { useAppSelector } from '../../state-management/hooks';
import Graph from './graph'

const graph = new Graph();

export default function RecoilNetwork() {
  const snapshotHistory = useAppSelector(
    state => state.snapshot.snapshotHistory,
  );
  const renderIndex = useAppSelector(state => state.snapshot.renderIndex);
  const filteredCurSnap = snapshotHistory[renderIndex].filteredSnapshot;

  const [graphContainer, setGraphContainer] = useState<HTMLDivElement>(null);

  const targetRecoilNodeName = useAppSelector(state => state.atomNetwork.searchValue);

  const snapshotWithRelatedNodes = targetRecoilNodeName ? getRelatedNodes(filteredCurSnap, targetRecoilNodeName) : filteredCurSnap;
  // 是否展示节点名称
  const isShowLabels = useAppSelector(state => state.atomNetwork.isShowLabels);
  const graphData = getGraphDataFromSnapshot(snapshotWithRelatedNodes, targetRecoilNodeName, isShowLabels);


  useEffect(() => {
    if (graphContainer) {
      graph.init(graphContainer);
    }
  }, [graphContainer]);

  useEffect(() => {
    if (graphContainer) {
      graph.debounceRender(graphData);
    }
  }, [graphData, graphContainer]);

  return (
    <div className="RecoilNetwork">
      <div className="graphArea" ref={(ele: HTMLDivElement) => setGraphContainer(ele)} />
    </div>
  );
}

// 获取与以目标recoil节点为中心，所有有关联的recoil节点
function getRelatedNodes(snapshot: filteredSnapshot, targetRecoilNodeName: string): filteredSnapshot {
  const recoilNode = snapshot[targetRecoilNodeName];

  // 处理中的节点
  const handlingNodes: node[] = [recoilNode];
  const newSnapshot: filteredSnapshot = { [targetRecoilNodeName]: snapshot[targetRecoilNodeName] };
  // 遍历所有跟当前节点关联的节点，生成新的snapshot子树
  while (handlingNodes.length) {
    const targetNode = handlingNodes.shift();
    const { nodeDeps = [], nodeToNodeSubscriptions = [] } = targetNode;
    _.forEach(_.concat(nodeDeps, nodeToNodeSubscriptions), (nodeName) => {
      if (!newSnapshot[nodeName]) {
        handlingNodes.push(snapshot[nodeName]);
        newSnapshot[nodeName] = snapshot[nodeName];
      }
    });
  }
  return newSnapshot;
}

function getGraphDataFromSnapshot(snapshot: filteredSnapshot, currentNodeName: string, isShowLabels: boolean) {
  const nodes: NodeConfig[] = [];
  let edges: EdgeConfig[] = [];

  _.forOwn(snapshot, (recoilNode, name) => {
    const { type, nodeDeps, nodeToNodeSubscriptions } = recoilNode;

    const ATOM_COLOR = 'red';
    const SELECTOR_COLOR = 'blue';

    const color = type === 'selector' ?  SELECTOR_COLOR : ATOM_COLOR;

    nodes.push({
      id: name,
      style: {
        fill: color,
        stroke: currentNodeName === name ? '#fff' : color,
      },
      label: isShowLabels ? name : '',
      size: 20,
      labelCfg: {
        position: 'bottom',
        offset: 10,
        style: {
          text: name,
          fill: '#fff',
        },
      }
    });
    _.forEach(nodeDeps, (nodeDep) => {
      edges.push({
        source: nodeDep,
        target: name,
      });
    });
    _.forEach(nodeToNodeSubscriptions, (subNode) => {
      edges.push({
        source: name,
        target: subNode,
      });
    });
  });

  edges = filterValidEdges(nodes, edges);

  return {
    nodes,
    edges,
  };
}

/**
 * 获取有效的边
 * @param edges
 * @param edge 
 */
function filterValidEdges(nodes: NodeConfig[], edges: EdgeConfig[]) {
  // 过滤掉重复的边
  const noReduplicativeEdges =  _.uniqWith(edges, _.isEqual);
  return _.reduce(noReduplicativeEdges, (res, edge) => {
    if (isExistNode(nodes, edge.source) && isExistNode(nodes, edge.target)) {
      // 边的开始和结束节点都存在在图中，才认为是有效边
      res.push(edge);
    }
    return res;
  }, []);
}

function isExistNode(nodes: NodeConfig[], nodeId: string) {
  return _.some(nodes, (node) => node.id === nodeId);
}
