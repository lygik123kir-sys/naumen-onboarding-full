import React from 'react';
import WearChartWidget from './WearChartWidget';
import QuickActionsWidget from './QuickActionsWidget';
import PartsForecastWidget from './PartsForecastWidget';

function WidgetRenderer({ widget }) {
  switch (widget.type) {
    case 'WEAR_CHART':
      return <WearChartWidget widget={widget} />;
    case 'QUICK_ACTIONS':
      return <QuickActionsWidget widget={widget} />;
    case 'PARTS_FORECAST':
      return <PartsForecastWidget widget={widget} />;
    default:
      return null;
  }
}

export default WidgetRenderer;