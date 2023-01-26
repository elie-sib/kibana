/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { SecurityFlyoutPanel } from '../../../common/store/flyout/panel-model';

export type EventPanelPaths = 'overview' | 'table' | 'json';

export interface EventPanel extends SecurityFlyoutPanel {
  key?: 'event';
  path?: EventPanelPaths[];
  params?: {
    id: string;
    indexName: string;
  };
}

export type VisualizePanelPaths = 'visualize' | 'insights' | 'investigation' | 'history';
export interface VisualizePanel extends SecurityFlyoutPanel {
  key?: 'visualize';
  path?: VisualizePanelPaths[];
  params?: {
    id: string;
    indexName: string;
  };
}

export type PreviewPanelPaths = 'process' | 'hosts' | 'alerts';
export interface PreviewPanel extends SecurityFlyoutPanel {
  key?: 'preview';
  path?: PreviewPanelPaths[];
  params?: {
    id: string;
    indexName: string;
  };
}
