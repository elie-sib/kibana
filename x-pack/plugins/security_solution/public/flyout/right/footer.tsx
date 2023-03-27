/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem, EuiFlyoutFooter } from '@elastic/eui';
import type { FC } from 'react';
import React, { memo, useCallback, useState } from 'react';
import { useExpandableFlyoutContext } from '@kbn/expandable-flyout';
import { useShallowEqualSelector } from '../../common/hooks/use_selector';
import type { inputsModel, State } from '../../common/store';
import { useExceptionFlyout } from '../../detections/components/alerts_table/timeline_actions/use_add_exception_flyout';
import { isActiveTimeline } from '../../helpers';
import { useEventFilterModal } from '../../detections/components/alerts_table/timeline_actions/use_event_filter_modal';
import { useHostIsolationTools } from '../../timelines/components/side_panel/event_details/use_host_isolation_tools';
import { useRightPanelContext } from './context';
import { TakeActionDropdown } from '../../detections/components/take_action_dropdown';
import { inputsSelectors } from '../../common/store';

/**
 *
 */
export const PanelFooter: FC = memo(() => {
  const { closeFlyout } = useExpandableFlyoutContext();
  const {
    indexName,
    dataFormattedForFieldBrowser,
    dataAsNestedObject,
    refetchFlyoutData,
    scopeId,
  } = useRightPanelContext();

  // TODO add endpoint exception
  // TODO add rule exception
  // TODO isolate host

  const getGlobalQueries = inputsSelectors.globalQuery();
  const globalQuery = useShallowEqualSelector((state: State) => getGlobalQueries(state));
  const getTimelineQuery = inputsSelectors.timelineQueryByIdSelector();
  const timelineQuery = useShallowEqualSelector((state: State) => getTimelineQuery(state, scopeId));
  const refetchQuery = (newQueries: inputsModel.GlobalQuery[]) => {
    newQueries.forEach((q) => q.refetch && (q.refetch as inputsModel.Refetch)());
  };
  const refetchAll = useCallback(() => {
    if (isActiveTimeline(scopeId)) {
      refetchQuery([timelineQuery]);
    } else {
      refetchQuery(globalQuery);
    }
  }, [scopeId, timelineQuery, globalQuery]);
  const { isHostIsolationPanelOpen, showHostIsolationPanel } = useHostIsolationTools();
  const { onAddEventFilterClick } = useEventFilterModal();
  const { onAddExceptionTypeClick } = useExceptionFlyout({
    refetch: refetchAll,
    isActiveTimelines: isActiveTimeline(scopeId),
  });
  const [_, setOsqueryFlyoutOpenWithAgentId] = useState<null | string>(null);

  if (!dataFormattedForFieldBrowser || !dataAsNestedObject) {
    return null;
  }

  return (
    <EuiFlyoutFooter>
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <TakeActionDropdown
            detailsData={dataFormattedForFieldBrowser}
            ecsData={dataAsNestedObject}
            handleOnEventClosed={closeFlyout}
            isHostIsolationPanelOpen={isHostIsolationPanelOpen}
            loadingEventDetails={false}
            onAddEventFilterClick={onAddEventFilterClick}
            onAddExceptionTypeClick={onAddExceptionTypeClick}
            onAddIsolationStatusClick={showHostIsolationPanel}
            refetchFlyoutData={refetchFlyoutData}
            refetch={refetchAll}
            indexName={indexName}
            scopeId={scopeId}
            onOsqueryClick={setOsqueryFlyoutOpenWithAgentId}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlyoutFooter>
  );
});

PanelFooter.displayName = 'PanelFooter';
