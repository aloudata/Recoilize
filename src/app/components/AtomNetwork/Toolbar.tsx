import _ from 'lodash';
import React, { useState, useCallback, ChangeEventHandler, } from 'react';
import { useAppSelector } from '../../state-management/hooks';
import { getSnapshotWithoutFallback } from '../../utils';
import { Select, Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { setIsShowLabels, setSearchValue } from '../../state-management/slices/AtomNetworkSlice';

const Option = Select.Option;

export default function Toolbar() {
  const snapshotHistory = useAppSelector(
    state => state.snapshot.snapshotHistory,
  );
  const renderIndex = useAppSelector(state => state.snapshot.renderIndex);
  const filteredCurSnap = snapshotHistory[renderIndex].filteredSnapshot;
  const snapShot = getSnapshotWithoutFallback(filteredCurSnap);
  const nodes = Object.keys(snapShot);

  const dispatch = useDispatch();

  const searchValue = useAppSelector(state => state.atomNetwork.searchValue);
  const onSelectNode = useCallback((name) => {
    dispatch(setSearchValue(name || ''));
  }, []);

  const isShowLabels = useAppSelector(state => state.atomNetwork.isShowLabels);
  const onChangeIsShowLabels = useCallback((isShow) => {
    dispatch(setIsShowLabels(isShow));
  }, []);

  return (
    <div className="atom-network-toolbar">
      <div className="tool-item">
        <div className="tip">
          recoil node:
        </div>
        <div className="filter-area">
          <Select
            showSearch
            onChange={onSelectNode}
            dropdownMatchSelectWidth={false}
            allowClear
            className="filter-node-select"
            value={searchValue}
          >
            {_.map(nodes, (node, index) => {
              return (
                <Option key={index} value={node}>
                  {node}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      <div className="tool-item">
        <div className="switch-area">
          <Switch checkedChildren="显示名称" unCheckedChildren="隐藏名称" checked={isShowLabels} onChange={onChangeIsShowLabels} />
        </div>
      </div>
    </div>
  );
}
