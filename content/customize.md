# Customize

Customization of layout and metadata is done in `data/layout.json` and `data/meta.json`, respectively.

In `layout.json`, define the different sections of your page. Each section has a controller which is reposnsible to render it, and some optional Markdown content that can be embedded by the controller. The Markdown content is rendered into HTML before being handed to the controller.

Using the `default` controller will simply embed the Markdown content in the page without any additional functionality.
