# Changelog

## [Unreleased]

- Add banner image
- Update to the latest version of `@grafana/create-plugin` (2.8.0)
    - Use `grafana/plugin-actions/build-plugin` action
    - Add dashboard provisioning

## 4.0.1

- Make exports default where possible
- Reverse gradients for light theme
    - The most saturated colors are the more recent data points, regardless of which theme
- Fix bug where normalized values would return a value outside of `[0, 1]` when `min = max`
- Minor improvements in region colorizing
- Updated some screenshots in `README`
    - Showing the panel editor options
    - Example with multiple data series
- Standalone app only published on version releases

## 4.0.0

- Psychart now has the ability to render multiple data series
    - Options are shown as nested options under `Data options` in the panel editor
    - Can now be labeled, and Psychart will show the series label in the hover text
    - Supports different styles for different series
    - Series count limit: 104 (send me an email if you would like this increased)
- Psychart will only attempt to plot data if the data series name is a valid option
- Panel editor options are now automatically validated
    - Deprecated options are now deleted from dashboard settings
- Reference files with relative paths without the `./`
- Data points now just store dry bulb + `other` value + measurement type, where `other` is either wet bulb, dew point, or relative humidity, depending on the measurement type
- Add version number in `README.md`
- Update to the latest version of `@grafana/create-plugin` (2.6.0)
    - Node version upgraded to `v20`
- Gradient icons are now automatically generated based on gradient definitions
- Gradient icons are now shown in [standalone app](https://psychart.nicfv.com/) when setting up Psychart
- Added 4 new gradients! [Credit](https://carto.com/carto-colors/)
    - Emerald
    - Mint
    - Sunset
    - Dusk

## 3.3.1

- Change `-r` flag to `-g` flag in runner (restarts local Grafana instance)
- Fix edge case in `normalize` function where `min = max`
- Psychrometric regions now utilize the full scale of the gradient
- Improve error checking for psychrometric states (remove nuisance error)
- Update data formatter for newer Grafana API version

## 3.3.0

- Update to the latest version of `@grafana/create-plugin` (2.0.2)
    - Grafana version required: `>=10.0.3`
- Node version updated to `v18`

## 3.2.3

- Update to the latest version of `@grafana/create-plugin` (1.12.0)

## 3.2.2

- Update to the latest version of `@grafana/create-plugin` (1.10.0)
- Fix incorrect plugin ID in `docker-compose.yaml`
- Remove references to `GRAFANA_API_KEY` in favor of `GRAFANA_ACCESS_POLICY_TOKEN`

## 3.2.1

- Update to the latest version of `@grafana/create-plugin` (1.9.0)
- Remove references to `npm` in build script
- Store series value in label named `field.config.displayNameFromDS`

## 3.2.0

- Update to the latest version of `@grafana/create-plugin` (1.6.3)
    - Grafana version required: `>=9.5.3`
- Automatically build and validate plugin in validation script

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