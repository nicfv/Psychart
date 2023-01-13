# Changelog

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