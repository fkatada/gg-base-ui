'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeRoot } from '../../composite/root/CompositeRoot';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';
import { TabsRoot } from '../root/TabsRoot';
import { type TabMetadata } from '../tab/useTabsTab';
import { useTabsList } from './useTabsList';
import { TabsListContext } from './TabsListContext';

const EMPTY_ARRAY: number[] = [];

/**
 * Groups the individual tab buttons.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export const TabsList = React.forwardRef(function TabsList(
  props: TabsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { activateOnFocus = true, className, loop = true, render, ...other } = props;

  const {
    direction,
    getTabElementBySelectedValue,
    onValueChange,
    orientation,
    value,
    setTabMap,
    tabActivationDirection,
  } = useTabsRootContext();

  const [highlightedTabIndex, setHighlightedTabIndex] = React.useState(0);

  const tabsListRef = React.useRef<HTMLElement>(null);

  const { getRootProps, onTabActivation } = useTabsList({
    getTabElementBySelectedValue,
    onValueChange,
    orientation,
    rootRef: forwardedRef,
    setTabMap,
    tabsListRef,
    value,
  });

  const state: TabsList.State = React.useMemo(
    () => ({
      orientation,
      tabActivationDirection,
    }),
    [orientation, tabActivationDirection],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    className,
    state,
    extraProps: other,
    customStyleHookMapping: tabsStyleHookMapping,
  });

  const tabsListContextValue: TabsListContext = React.useMemo(
    () => ({
      activateOnFocus,
      highlightedTabIndex,
      onTabActivation,
      setHighlightedTabIndex,
      tabsListRef,
      value,
    }),
    [
      activateOnFocus,
      highlightedTabIndex,
      onTabActivation,
      setHighlightedTabIndex,
      tabsListRef,
      value,
    ],
  );

  return (
    <TabsListContext.Provider value={tabsListContextValue}>
      <CompositeRoot<TabMetadata>
        highlightedIndex={highlightedTabIndex}
        enableHomeAndEndKeys
        loop={loop}
        direction={direction}
        orientation={orientation}
        onHighlightedIndexChange={setHighlightedTabIndex}
        onMapChange={setTabMap}
        render={renderElement()}
        disabledIndices={EMPTY_ARRAY}
      />
    </TabsListContext.Provider>
  );
});

export namespace TabsList {
  export type State = TabsRoot.State;

  export interface Props extends BaseUIComponentProps<'div', TabsList.State> {
    /**
     * Whether to automatically change the active tab on arrow key focus.
     * Otherwise, tabs will be activated using Enter or Spacebar key press.
     * @default true
     */
    activateOnFocus?: boolean;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
  }
}
