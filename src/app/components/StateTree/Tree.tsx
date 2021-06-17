import _ from 'lodash';
import React, {useState, useCallback, useEffect} from 'react';
import JSONTree from 'react-json-tree';
import {useAppSelector} from '../../state-management/hooks';

const INCLUDE_STORAGE_KEY = 'state_tree_include_text';
const EXCLUDE_STORAGE_KEY = 'state_tree_exclude_text';

const Tree: React.FC = () => {
  // render json tree while passing in newSnap as data to JSONTree
  //Retrieve snapshotHistory State from Redux Store
  const snapshotHistory = useAppSelector(
    state => state.snapshot.snapshotHistory,
  );
  const renderIndex = useAppSelector(state => state.snapshot.renderIndex);
  const filteredCurSnap = snapshotHistory[renderIndex].filteredSnapshot;

  const [includeText, setIncludeText] = useState('');
  const [excludeText, setExcludeText] = useState('');

  useEffect(() => {
    // 回填以前使用过的过滤关键词
    if (!includeText) {
      const preIncludeText = localStorage.getItem(INCLUDE_STORAGE_KEY);
      if (preIncludeText) {
        setIncludeText(preIncludeText);
      }
    }
    if (!excludeText) {
      const preExcludeText = localStorage.getItem(EXCLUDE_STORAGE_KEY);
      if (preExcludeText) {
        setExcludeText(preExcludeText);
      }
    }
  }, [setIncludeText, setExcludeText]);

  const DEBOUNCE_TIME = 300;

  const onChangeIncludeText = useCallback(
    _.debounce(
      (val: string) => {
        setIncludeText(val);
        localStorage.setItem(INCLUDE_STORAGE_KEY, val);
      },
    DEBOUNCE_TIME),
    [setIncludeText],
  );

  const onChangeExcludeText = useCallback(
    _.debounce(
      (val: string) => {
        setExcludeText(val);
        localStorage.setItem(EXCLUDE_STORAGE_KEY, val);
      },
    DEBOUNCE_TIME),
    [setExcludeText],
  );

  const snapshot = filterByIncludeAndExclude(filteredCurSnap, includeText, excludeText);

  return (
    <div className="Tree">
      <div className="filter-area">
        <div style={{display: 'inline-block'}}>
          <span className="tree-filter-title">include:</span>
          <input type="text" value={includeText} className="input" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeIncludeText(e.target.value)} />
        </div>
        <div style={{display: 'inline-block'}}>
          <span className="tree-filter-title">exclude:</span>
          <input type="text" value={excludeText} className="input" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeExcludeText(e.target.value)} />
        </div>
      </div>
      {filteredCurSnap && (
        <JSONTree
          data={snapshot}
          theme={{tree: () => ({className: 'json-tree'})}}
          shouldExpandNode={(keyPath, data, level) => level === 0}
          labelRenderer={raw =>
            typeof raw[0] !== 'number' ? (
              <span style={{fontSize: '14px'}}>{raw[0]}</span>
            ) : null
          }
        />
      )}
    </div>
  );
};

export default Tree;

/**
 * 根据关键词过滤要展示的snapshot的key
 * @param snapshot
 * @param includeText
 * @param excludeText
 */
function filterByIncludeAndExclude(snapshot: { [key: string]: any }, includeText: string, excludeText: string) {
  const res: { [key: string]: any } = {};
  _.forOwn(snapshot, (val, key) => {
    const lowCaseKey = key.toLowerCase();
    if (excludeText && lowCaseKey.indexOf(excludeText.toLowerCase()) !== -1) {
      return;
    }
    if (includeText && lowCaseKey.indexOf(includeText.toLowerCase()) === -1)  {
      return;
    }
    res[key] = val;
  });
  return res;
}
