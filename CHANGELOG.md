# Changelog

## 3.1.3

- Update to the latest version of `@grafana/create-plugin` (1.3.0)
- Change `yarn` commands to `npm run`

## 3.1.2

- Move `README.md` from base folder to `src/`
- Update dependencies

## 3.1.1

- Screenshots are moved to `README.md`

## 3.1.0

- Screenshots are no longer packaged with the plugin
- Add more and new screenshots with better descriptions
- Fix bug that prevented the default gradient from being set
- Don't attempt to plot data if no field names are selected
- Show an error if field is not found or otherwise invalid
- Show an error if maximum dew point > maximum dry bulb
- Add author contact information in `plugin.json`
- Publishing script now ensures changelog matches published version number

## 3.0.1

- Set `Viridis` as the default color gradient
- Add a short blurb in `README.md` in **Troubleshooting** to explain how to fix errors when upgrading to major versions

## 3.0.0

- Migrate from a JavaScript to a TypeScript code base
- Dynamically generate region & gradient selections in both the [standalone app](https://psychart.nicfv.com/) and the [Grafana plugin](https://grafana.com/grafana/plugins/ventura-psychrometric-panel/)
    - This means, less code duplication, so it will be much easier to add additional regions or gradients in the future
- Regions are now rendered in a blue gradient instead of a violet gradient
- Tooltips now follow the mouse instead of being in predefined calculated positions
- Regions, chart axes, and points are no longer rendered outside of chart boundaries
- Rebuild with `npx @grafana/create-plugin@1.0.0` to make sure source files and dependencies are up-to-date
- Better support for **long** and **multi-frame** time series (**wide** time series still not implemented)
    - For now, if you are using a **wide** time series, use the Grafana transform to convert to the **long** or **multi-frame** format
- Standalone app now adds timestamps to data points by default
- Minor updates in `README.md` to explain new ASHRAE guidelines and to update badges
- Add link to [official Grafana blog post](https://grafana.com/blog/2022/10/14/how-to-monitor-high-performance-computing-system-health-with-grafana-and-psychrometric-charts/) in `plugin.json`
- Add more relevant search keywords in `plugin.json`

## 2.0.1

- Fixed broken badges in `README.md`
- Fixed link to copyright notice in `README.md`
- Removed references to plugin signing
- Minor improvements to build pipeline

## 2.0.0

- Use the new Grafana plugin builder from
    ```sh
    npx @grafana/create-plugin
    ```
- Added additional workflows for compatibility and testing the build

## 1.1.1

Minor updates in packaging.

- Fixed instances of incorrect package name.
- Updated website URL
- Added plugin download URL

## 1.1.0

First public release in Grafana. [Click here](https://grafana.com/grafana/plugins/ventura-psychrometric-panel/) to visit the plugin's page.

- Updated badges
- Updated screenshots
- Other small fixes in `README`

## 1.0.2

Pre-release with a few minor non-code updates.

- Small edits in `README` and `CHANGELOG`

## 1.0.1

Pre-release with data source bug fix.

- Psychart can now detect if a data source calls each series by its frame name, field name, or a concatenation of both (for example, the Static Datasource)

## 1.0.0

Initial release with base features.

- Visualization of one data series of psychrometric properties with various field options
- A robust chart editor with graph options and display options
- Interactivity via hovering over data points or parts of the graph with the mouse