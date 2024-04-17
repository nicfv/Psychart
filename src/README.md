# Psychart v%VERSION%

### _A Psychrometric Chart for Monitoring Data Center Health & Human Comfort_

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/ci.yml)](https://github.com/nicfv/Psychart)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/is-compatible.yml?label=compatible)](https://github.com/nicfv/Psychart)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/release.yml?label=release)](https://github.com/nicfv/Psychart/releases)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nicfv/Psychart/pages.yml?label=pages)](https://psychart.nicfv.com/)

[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fventura-psychrometric-panel)](https://grafana.com/grafana/plugins/ventura-psychrometric-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fventura-psychrometric-panel)](https://grafana.com/grafana/plugins/ventura-psychrometric-panel)
[![Popularity](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=popularity&query=popularity&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fventura-psychrometric-panel)](https://grafana.com/grafana/plugins/ventura-psychrometric-panel)

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

Psychart is capable of plotting several data series of states per panel. The amount of data series is defined by the series count. Due to the fact that 2 properties are needed to fix the state, at least two numeric time-dependent fields are required. The user must select whether those two fields are dry bulb and wet bulb, dry bulb and dew point, or dry bulb and relative humidity. These fields must then be entered into the field selectors below respectively.

It is important to note that one or two queries may be necessary depending on the data structure. One single query may be sufficient to return the two fields needed to fix the state. Other times, one query will be needed to obtain the dry bulb field and another for relative humidity field, for example.

Different data series are independent from one another - one series may incorporate dry bulb and wet bulb measurements, and another may incorporate dry bulb and dew point measurements, for instance.

### Series display options

This section configures each individual data series.

First, a legend must be set. This will name your data series as well as add a label when hovering the cursor over the plotted data. Then, select the 2 data series which represent the 2 psychrometric measurements.

The rest of the options change the visual appearance of data within the chart. This allows the user to change the point radius, optionally draw a line between adjacent points in time, and select a color gradient for the data series. Gradients always use the more saturated/contrasting colors for the more recent data points, regardless of which theme (light/dark) is preferred. The user can also optionally select to view more state variables here.

## Errors & Troubleshooting

Some errors can arise from the [Data options](#data-options) section due to the fact that wet bulb and dew point must be less than or equal to the dry bulb temperature and relative humidity must be within the range of 0-1. If relative humidity is a driving measurement, make sure that the measurement type is correct (0-1 or 0%-100%). For other measurements, make sure that they are being reported correctly.

Psychart matches up values with similar timestamps. For a dry bulb & relative humidity series, the dry bulb measurement timestamp must match that of the relative humidity timestamp in order to be recognized as a single point. The _Query options_ in the query inspector may provide the tools required to fix any time discrepancies.

Importantly, if there is missing data in one field, for example if dry bulb temperature has not been reporting for the last 5 minutes, no new states are calculated, and no new data is plotted in Psychart for the last 5 minutes to avoid the display of inaccurate data.

Psychart works best both visually and practically when observing a narrow span of time. If Psychart is loading very slowly, try to decrease the _Time range_ in Grafana. Both absolute and relative time spans are accepted by Psychart. If the data still seems too cluttered, try disabling the line that connects the series, reducing the point radius, or reducing the amount of data series rendered on a single panel.

Finally, if there are issues after upgrading to a newer version of Psychart, (for example the regions are not being rendered) try to open the panel editor, reapply your customization settings, and save the panel. Sometimes, the panel options are not properly stored from version to version.

## License

Psychart was created by Nicolas Ventura, owned by Berkeley Lab, a DOE funded national laboratory, and is distributed under the [BSD-3-Clause-LBNL](https://raw.githubusercontent.com/nicfv/Psychart/main/LICENSE) license.

| Plugin ID | Last Updated | Version |
| --------- | ------------ | ------- |
| `%PLUGIN_ID%` | `%TODAY%` | `%VERSION%` |

[Copyright Notice](https://raw.githubusercontent.com/nicfv/Psychart/main/LEGAL)

## Screenshots

