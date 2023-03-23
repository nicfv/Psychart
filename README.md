# Psychart

### _A Psychrometric Chart for Monitoring Data Center Health & Human Comfort_

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/ci.yml)](https://github.com/nicfv/Psychart)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/is-compatible.yml?label=compatible)](https://github.com/nicfv/Psychart)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/release.yml?label=release)](https://github.com/nicfv/Psychart/releases)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/pages.yml?label=pages)](https://psychart.nicfv.com/)
[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22ventura-psychrometric-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/ventura-psychrometric-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22ventura-psychrometric-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/ventura-psychrometric-panel)

View air conditions on a psychrometric chart.

## What is a psychrometric chart?

Psychrometric charts are charts adopted by [ASHRAE](https://www.ashrae.org/) that plot various thermodynamic properties of air-vapor mixtures. These charts are particularly useful in HVAC applications. The following properties describe what's called a _state_ of air. **Two** properties are needed to fix the state of air, which means that two properties are needed in order to calculate every other property. The following 4 properties are plotted by Psychart by default:

- Dry Bulb
  - The temperature of air using a dry thermometer.
- Wet Bulb
  - Wet bulb temperature can be practically explained by the temperature of a surface where water is evaporating.
- Dew Point
  - Water will condense from the air at or below this temperature.
- Relative Humidity
  - A ratio of vapor pressure in the air to the saturation vapor pressure. 0%rh indicates absolutely dry air, and 100%rh indicates saturated air.

Psychart also has the capability to derive the following state variables, which are optionally displayed using the _Show Advanced State Variables_ switch in [Display options](#display-options).

- Vapor Pressure
  - The partial pressure of water in the vapor-air mixture.
- Humidity Ratio
  - Weight of water vapor per weight of dry air.
- Enthalpy
  - In thermodynamics, refers to the total heat content of the vapor-air mixture.
- Specific Volume
  - Amount of volume taken up by one unit of mass of the vapor-air mixture.

## Getting started

This section will go over the options in the panel editor.

### Panel options

This is the default panel options for all Grafana panels which gives the user access to the panel title and description and other UI effects.

### Chart options

These options affect how the chart itself is displayed.

Allows the user to select whether measurements are being reported in US or SI units, the local altitude, graph bounds, and optionally display ASHRAE comfort regions (envelopes). For data center envelopes, these comfort regions follow the 2021 ASHRAE standard and are designed for data centers and IT spaces of various criticality. For human comfort envelopes, these comfort regions follow the ASHRAE-55 guidelines published in 2017. These human comfort envelopes are a function of metabolic rate (`MET`, which is dependent on the indoor activity), clothing level (`CLO`), and air speed. In both cases, the envelopes show the target region for conditioned air supplied into the indoor space.

### Data options

These options help process the incoming data.

Psychart is capable of plotting 1 series of states per panel. Due to the fact that 2 properties are needed to fix the state, two numeric time-dependent fields are required. The user must select whether those two fields are dry bulb and wet bulb, dry bulb and dew point, or dry bulb and relative humidity. These fields must then be entered into the field selectors below respectively.

It is important to note that one or two queries may be necessary depending on the data structure. One single query may be sufficient to return the two fields needed to fix the state. Other times, one query will be needed to obtain the dry bulb field and another for relative humidity field, for example.

### Display options

This section changes the visual appearance of data within the chart.

Allows the user to change the point radius, optionally draw a line between adjacent points in time, and select a color gradient for the data series. The user can also optionally select to view more state variables here.

## Errors & Troubleshooting

Some errors can arise from the [Data options](#data-options) section due to the fact that wet bulb and dew point must be less than or equal to the dry bulb temperature and relative humidity must be within the range of 0-1. If relative humidity is a driving measurement, make sure that the measurement type is correct (0-1 or 0%-100%). For other measurements, make sure that they are being reported correctly.

Psychart matches up values with similar timestamps. For a dry bulb & relative humidity series, the dry bulb measurement timestamp must match that of the relative humidity timestamp in order to be recognized as a single point. The _Query options_ in the query inspector may provide the tools required to fix any time discrepancies.

Importantly, if there is missing data in one field, for example if dry bulb temperature has not been reporting for the last 5 minutes, no new states are calculated, and no new data is plotted in Psychart for the last 5 minutes to avoid the display of inaccurate data.

Psychart works best both visually and practically when observing a narrow span of time. If Psychart is loading very slowly, try to decrease the _Time range_ in Grafana. Both absolute and relative time spans are accepted by Psychart. If the data still seems too cluttered, try disabling the line that connects the series or reducing the point radius.

Finally, if there are issues after upgrading to a newer version of Psychart, (for example the regions are not being rendered) try to open the panel editor, reapply your customization settings, and save the panel. Sometimes, the panel options are not properly stored from version to version.

## License

Psychart was created by Nicolas Ventura and is distributed under a [modified BSD License](https://raw.githubusercontent.com/nicfv/Psychart/main/LICENSE). Plugin ID: `ventura-psychrometric-panel`

[Copyright Notice](https://raw.githubusercontent.com/nicfv/Psychart/main/LEGAL)

## Screenshots

![HVAC use case: Air handler supply temperatures.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/summer.png)
![There are many different styling options for Psychart.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/winter.png)
![Psychart can render data in imperial or metric units!](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/metric.png)
![IT use case: Data center supply air conditions.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/data_center.png)
![Hover the mouse over the shaded regions to learn more!](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/region_hover.png)
![Hover the mouse over the data points to show the thermodynamic properties of air. (Currently showing advanced state variables.)](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/style.png)
![Meteorological use case: Long-term outdoor air conditions.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/outdoor.png)
![General use case: Psychart as a thermodynamic calculator.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/editor.png)
![Grafana configuration options for Psychart.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/editor.png)
![Data options panel for Psychart.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/data_options.png)
![Display options panel for Psychart.](https://raw.githubusercontent.com/nicfv/Psychart/main/screenshots/display_options.png)
