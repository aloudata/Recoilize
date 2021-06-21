import { IG6GraphEvent } from '@antv/g6-core';
import _ from 'lodash';
import G6, { Graph as G6Graph, EdgeConfig, NodeConfig, Tooltip } from '@antv/g6';

export default class Graph {
  debounceRender = this.render;
  graph: G6Graph | null = null;
  currentGraphData: IGraphData = { nodes: [], edges: [] };

  constructor() {
    this.debounceRender = _.debounce(this.render, 500);
  }

  init(container: HTMLDivElement) {
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const graph = new G6.Graph({
      container,
      width,
      height,
      maxZoom: 2,
      modes: {
        default: ['zoom-canvas', 'drag-canvas', 'drag-node'],
      },
      layout: {
        type: 'forceAtlas2',
        preventOverlap: true,
        kr: 60,
      },
      defaultNode: {
        size: 20,
      },
      plugins: [this.getTooltipPlugin()]
    });
    graph.on('afterlayout', e => {
      graph.fitView()
    });
    this.graph = graph;
  }

  getTooltipPlugin() {
    return new Tooltip({
      offsetX: 10,
      offsetY: 20,
      getContent: (e: IG6GraphEvent) => e.item.getModel().id,
      itemTypes: ['node'],
    });
  }

  render(graphData: IGraphData) {
    if (!this.graph) {
      return;
    }
    if (_.isEqual(graphData, this.currentGraphData)) {
      return;
    }
    // @ts-ignore
    this.graph.data(graphData);
    this.graph.render();
    this.currentGraphData = graphData;
  }
}

export interface IGraphData {
  nodes: NodeConfig[];
  edges: EdgeConfig[];
}
