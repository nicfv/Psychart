# Changelog

## Unreleased (5.0.4)

- Update to the latest version of `psychart` (0.10.0)
- Update to the latest version of `viridis` (1.4.2)
- Update to the latest version of `@grafana/create-plugin` (6.6.0)

## 5.0.4

- Update to the latest version of `viridis` (1.3.1)
- Update to the latest version of `@grafana/create-plugin` (6.1.7)

## 5.0.3

- Update to the latest versions of `psychart` (0.6.1) and `viridis` (1.2.1)
- Update to the latest version of `@grafana/create-plugin` (5.26.9)
- Fix broken profile link in README

## 5.0.2

- Update to the latest versions of `psychart` (0.6.0) and `viridis` (1.2.0)
- Update to the latest version of `@grafana/create-plugin` (5.25.8)

## 5.0.1

- Update to the latest version of `psychart` (0.5.0, [changelog](https://npm.nicfv.com/documents/psychart.CHANGELOG.html))
    - Makes multiple panels of Psychart on the same dashboard, more robust, and skips generating the legend when it's toggled off
- Add new screenshot to show off the ability to plot multiple data series
- Update to the latest version of `@grafana/create-plugin` (5.22.1)

## 5.0.0

- Break out Psychart source code into its own [npm package](https://www.npmjs.com/package/psychart). Major updates include:
    - Adding a legend! Legend is interactive; clicking on a series name in the legend will toggle its points visibility
    - Mollier diagrams now will show humidity ratio on their x-axis, instead of dew point
    - Units are shown both on the axis labels and in the axis tooltips
    - Psychart now calculates degree of saturation, which can be shown in "advanced" mode!
- Standalone app: Enter data display options after generating chart, and while plotting data
- Add more examples and instructions into the provisioning dashboard
- Remove all screenshots, new screenshots of new version will be added in a future update
- Use builtin `<PanelDataErrorView>` Grafana React element to show errors
- Organize folder structure to better match Grafana's default plugin
- No longer need to package all gradient icons with the plugin! Icons are now generated on-the-fly and their URLs are generated.
- Panel editor changes:
    - Add toggle to show legend
    - Add options to adjust axis major intervals
    - Remove "enabled" switch (since series can now be hidden by simply clicking on their name in the legend)
- Re-package new screenshots with the plugin
- Add (empty) unit tests file
- Minor updates in main README (e.g. mention variable interpolation, fix broken link)
- Add build attestation in Grafana workflow
- Add options migration handling from version 4.x.x to version 5.x.x
- Update to the latest version of `@grafana/create-plugin` (5.19.5)

## 4.5.4

- Update to the latest version of `@grafana/create-plugin` (5.11.1)
- Update dependency versions

## 4.5.3

- Update to the latest version of `@grafana/create-plugin` (5.9.3)
    - Address Dependabot security vulnerabilities
    - Update `node` version to 22
- Thank you to the Grafana team for addressing [#1328](https://github.com/grafana/plugin-tools/issues/1328)!

## 4.5.2

- Update to the latest version of `@grafana/create-plugin` (5.5.2)
- Fixed a bug where data series would initially be disabled, for existing dashboards that upgraded to plugin version 4.5.1

## 4.5.1

- Add an option called `Enable` when unchecked, will hide data series
- Update to the latest version of `@grafana/create-plugin` (5.3.10)

## 4.5.0

- Add new comfort region: Comfort Zone of the Building Bioclimatic Chart (based on Milne and Givoni 1979 & ASHRAE 55-2017)
- Update to the latest version of `@grafana/create-plugin` (5.2.2)

## 4.4.0

- Update to the latest version of `@grafana/create-plugin` (4.16.3)
    - Grafana version required: `>=10.4.0`
- Update dependency versions

## 4.3.2

- Update to the latest version of `@grafana/create-plugin` (4.12.0)
- Remove dependency on Grafana legacy classes
- Update dependency versions in `pages.yml` workflow file
    - NodeJS updated to version 20

## 4.3.1

- Update to the latest version of `@grafana/create-plugin` (4.10.1)
- Track `package-lock.json` in repository

## 4.3.0

- Update to the latest version of `@grafana/create-plugin` (4.6.2)
    - Grafana version required: `>=10.3.3`
    - Compatibility check workflow is now fixed!
- Update dependency versions of [`smath`](https://www.npmjs.com/package/smath) (1.8.5) and [`viridis`](https://www.npmjs.com/package/viridis) (1.1.4)
- Support the ability to render [Mollier Diagrams](https://en.wikipedia.org/wiki/Enthalpy%E2%80%93entropy_chart) by mirroring Psychart on the `x=y` line (thanks for the idea, [@yevgeny7](https://github.com/yevgeny7)!)
- Improve panel interior padding by splitting it into `x` and `y` values instead of using a single value
- Add placeholders in all panel option fields (shown when field is empty)
- Min/max values for `dbMax` and `dpMax` options are now dynamically calculated so that `dbMax` must be strictly greater than or equal to `dpMax`
- Improve code quality by...
    - Changing `let` to `const`
    - Adding `readonly` modifiers where possible
    - Adding explicit access modifiers (by default, TypeScript sets all class members `public` if not specified)
- Minor Webpack configuration simplifications (standalone app)
- Fix bug where relative humidity was displayed from 0-1 instead of 0-100%
- Update screenshots

## 4.2.2

- Bug fix where region shading gradient was not reversed for light theme
- Updates to [standalone app](https://psychart.nicfv.com/)
    - Add option for rendering IBM TS4500 ambient envelopes
    - Use `script defer` and remove window load event listener

## 4.2.1

- Update dependency versions
- Clean script can now remove backups
- Minor cleanups within `Psychart` class

## 4.2.0

- Add LBL/DOE notice in README
- Replace custom `JMath` with [`smath`](https://www.npmjs.com/package/smath) dependency for linear interpolation functions
- Replace custom `Color` with [`viridis`](https://www.npmjs.com/package/viridis) dependency for color gradient functions
    - Allow all default/builtin gradients from this package, adds >10 new gradients to Psychart!
    - Use "Purplish" palette for region shading
- Default series names are numbered instead of lettered
- Maximum of 100 data series rendered on Psychart
- Remove `default` exports over preference to named exports (undo change from [4.0.1](#401))
- Region shading is now affected by your Grafana theme for better contrast
- Add IBM TS4500 ambient condition envelopes

## 4.1.0

- Update to the latest version of `@grafana/create-plugin` (4.0.1)
- Add link to [issues](https://github.com/nicfv/Psychart/pull/11) in main README page and plugin page
- Minor updates to runner update command (select non-hidden files only)
- Correctly set the license type in package.json (thank you, [@nagisa](https://github.com/nagisa)!) [#10](https://github.com/nicfv/Psychart/pull/10) and README
- Add extra stats towards the bottom of the plugin README
- Remove duplicate images in build output

## 4.0.6

- Update to the latest version of `@grafana/create-plugin` (3.5.0)
    - Updates workflow action dependency versions, thanks to my [pull request](https://github.com/grafana/plugin-tools/pull/711)!
- Update dashboard provisioning configuration
    - Datasource is random 30Hz data stream
- Add `-U` flag in runner that will automatically re-build with latest version of `@grafana/create-plugin`

## 4.0.5

- Update to the latest version of `@grafana/create-plugin` (3.1.3)

## 4.0.4

- Update to the latest version of `@grafana/create-plugin` (2.11.1)

## 4.0.3

- Update to the latest version of `@grafana/create-plugin` (2.10.1)
    - Use `grafana/plugin-actions/build-plugin` action
- Add popularity badge in plugin README

## 4.0.2

- Add banner image in GitHub repository
- Update to the latest version of `@grafana/create-plugin` (2.8.0)
    - Except for `grafana/plugin-actions/build-plugin` action
    - Add dashboard provisioning
- Major updates to runner file
    - Check options using `getopts`
    - Redesign logic/error messages for plugin validation and publishing

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
