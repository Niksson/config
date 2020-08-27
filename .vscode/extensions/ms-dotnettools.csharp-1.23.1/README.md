## C# for Visual Studio Code (powered by OmniSharp)

|                                                                     Master                                                                     |                                                                     Release                                                                      |
| :--------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: |
| [![Master Build Status](https://travis-ci.org/OmniSharp/omnisharp-vscode.svg?branch=master)](https://travis-ci.org/OmniSharp/omnisharp-vscode) | [![Release Build Status](https://travis-ci.org/OmniSharp/omnisharp-vscode.svg?branch=release)](https://travis-ci.org/OmniSharp/omnisharp-vscode) |

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-configured-green.svg)](https://wallabyjs.com)

Welcome to the C# extension for Visual Studio Code! This extension provides the following features inside VS Code:

-   Lightweight development tools for [.NET Core](https://dotnet.github.io).
-   Great C# editing support, including Syntax Highlighting, IntelliSense, Go to Definition, Find All References, etc.
-   Debugging support for .NET Core (CoreCLR). NOTE: Mono debugging is not supported. Desktop CLR debugging has [limited support](https://github.com/OmniSharp/omnisharp-vscode/wiki/Desktop-.NET-Framework).
-   Support for project.json and csproj projects on Windows, macOS and Linux.

The C# extension is powered by [OmniSharp](https://github.com/OmniSharp/omnisharp-roslyn).

### Get Started Writing C# in VS Code

-   [Documentation](https://code.visualstudio.com/docs/languages/csharp)
-   [Video Tutorial compiling with .NET Core](https://channel9.msdn.com/Blogs/dotnet/Get-started-VSCode-Csharp-NET-Core-Windows)

## Note about using .NET Core 3.1.401 or .NET 5 Preview 8 SDKs on Mono platforms

Because of the new minimum MSBuild version requirement of these new SDKs, it will be necessary to use the Mono packaged with the C# extension. The meaning of "omnisharp.useGlobalMono" has change to "never", this forces the use of the included Mono. To use your system
install of Mono set the value to "always" although it may not be compatible with newer SDKs.

## What's new in 1.23.1
-   Register FixAll commands for disposal ([#3984](https://github.com/OmniSharp/omnisharp-vscode/issues/3984), PR: [#3985](https://github.com/OmniSharp/omnisharp-vscode/pull/3985))
-   Register FixAll commands for disposal ([#3984](https://github.com/OmniSharp/omnisharp-vscode/issues/3984), PR: [#3985](https://github.com/OmniSharp/omnisharp-vscode/pull/3985))
-   Include version matched target files with minimal MSBuild (PR: [omnisharp-roslyn#1895](https://github.com/OmniSharp/omnisharp-roslyn/pull/1895))
-   Fix lack of trailing italics in quickinfo (PR: [omnisharp-roslyn#1894](https://github.com/OmniSharp/omnisharp-roslyn/pull/1894))
-   Set meaning of UseGlobalMono "auto" to "never" until Mono updates their MSBuild (PR: [#3998](https://github.com/OmniSharp/omnisharp-vscode/pull/3998))
-   Updated Razor support
    -   Fully qualify component light bulb ([dotnet/aspnetcore-tooling#22309](https://github.com/dotnet/aspnetcore/issues/22309))
    -   Add using for component light bulb ([dotnet/aspnetcore-tooling#22308](https://github.com/dotnet/aspnetcore/issues/22308))
    -   Create component from tag light bulb ([dotnet/aspnetcore-tooling#22307](https://github.com/dotnet/aspnetcore/issues/22307))
    -   Go to definition on Blazor components ([dotnet/aspnetcore-tooling#17044](https://github.com/dotnet/aspnetcore/issues/17044))
    -   Rename Blazor components ([dotnet/aspnetcore-tooling#22312](https://github.com/dotnet/aspnetcore/issues/22312))
    -   Prepare Blazor debugging to have better support for "Start without debugging" scenarios ([dotnet/aspnetcore-tooling#24623](https://github.com/dotnet/aspnetcore/issues/24623))

## What's new in 1.23.0
-   Fix typo in supressBuildAssetsNotification setting name ([#3941](https://github.com/OmniSharp/omnisharp-vscode/issues/3941), PR: [#3942](https://github.com/OmniSharp/omnisharp-vscode/pull/3942))
-   Introduced a new `/quickinfo` endpoint to provide a richer set of information compared to `/typeinfo`. Consumers are encouraged to use it as their hover provider ([omnisharp-roslyn#1808](https://github.com/OmniSharp/omnisharp-roslyn/issues/1808), PR: [omnisharp-roslyn#1860](https://github.com/OmniSharp/omnisharp-roslyn/pull/1860)
-   Added support for Roslyn `EmbeddedLanguageCompletionProvider` which enables completions for string literals for `DateTime` and `Regex` ([omnisharp-roslyn#1871](https://github.com/OmniSharp/omnisharp-roslyn/pull/1871))
-   Improve performance of the `textDocument/codeAction` request. (PR: [omnisharp-roslyn#1814](https://github.com/OmniSharp/omnisharp-roslyn/pull/1814))
-   Provide a warning when the discovered MSBuild version is lower than the minimumMSBuildVersion supported by the configured SDK (PR: [omnisharp-roslyn#1875](https://github.com/OmniSharp/omnisharp-roslyn/pull/1875))
-   Use the real MSBuild product version during discovery (PR: [omnisharp-roslyn#1876](https://github.com/OmniSharp/omnisharp-roslyn/pull/1876))
-   Fixed debugging in .NET 5 preview SDKs ([#3459](https://github.com/OmniSharp/omnisharp-vscode/issues/3459), PR: [omnisharp-roslyn#1862](https://github.com/OmniSharp/omnisharp-roslyn/pull/1862))
-   Move omnisharp vscode to the new hover implementation ([#3928](https://github.com/OmniSharp/omnisharp-vscode/pull/3928))
-   Ignore screen size is bogus errors with ps ([#3580](https://github.com/OmniSharp/omnisharp-vscode/issues/3580), PR: [#3961](https://github.com/OmniSharp/omnisharp-vscode/pull/3961))
-   Fix all providers support (PR: [#3440](https://github.com/OmniSharp/omnisharp-vscode/pull/3440), PR: [omnisharp-roslyn#1581](https://github.com/OmniSharp/omnisharp-roslyn/pull/1581))
-   Fix MSBuild version mismatch with new SDKs ([omnisharp-vscode#3951](https://github.com/OmniSharp/omnisharp-vscode/issues/3951), PR: [#1883](https://github.com/OmniSharp/omnisharp-roslyn/pull/1883))

## What's new in 1.22.2
-   Updated Razor support
    -   Improved Semantic Highlighting support by fixing some scenarios which might lead to thrown exceptions and incorrect results. [dotnet/aspnetcore-tooling#2126](https://github.com/dotnet/aspnetcore-tooling/pull/2126)
    -   Fixed support in the case of projects with spaces in path. [dotnet/aspnetcore#23336](https://github.com/dotnet/aspnetcore/issues/23336)
    -   Various performance improvements.
    -   `@inject` completion [dotnet/aspnetcore#22886](https://github.com/dotnet/aspnetcore/issues/22886)
    -   Improved behavior in cases where directory is not available. [dotnet/aspnetcore-tooling#2008](https://github.com/dotnet/  aspnetcore-tooling/pull/2008)
    -   Added the `Extract to CodeBehind` light bulb code action. [dotnet/aspnetcore-tooling#2039](https://github.com/dotnet/aspnetcore-tooling/pull/2039)
-   Use global MSBuild property when resetting target framework ([omnisharp-roslyn#1738](https://github.com/OmniSharp/omnisharp-roslyn/issues/1738), PR: [omnisharp-roslyn#1846](https://github.com/OmniSharp/omnisharp-roslyn/pull/1846))
-   Do not use Visual Studio MSBuild if it doesn't have .NET SDK resolver ([omnisharp-roslyn#1842](https://github.com/OmniSharp/omnisharp-roslyn/issues/1842), [omnisharp-roslyn#1730](https://github.com/OmniSharp/omnisharp-roslyn/issues/1730), PR: [omnisharp-roslyn#1845](https://github.com/OmniSharp/omnisharp-roslyn/pull/1845))
-   Only request dotnet info once for the solution or directory ([omnisharp-roslyn#1844](https://github.com/OmniSharp/omnisharp-roslyn/issues/1844), PR: [omnisharp-roslyn#1857](https://github.com/OmniSharp/omnisharp-roslyn/pull/1857))
-   Allow client to specify symbol filter for FindSymbols Endpoint. (PR: [omnisharp-roslyn#1823](https://github.com/OmniSharp/omnisharp-roslyn/pull/1823))
-   Upgraded to Mono 6.10.0.105, msbuild 16.6 and added missing targets (PR: [omnisharp-roslyn#1854](https://github.com/OmniSharp/omnisharp-roslyn/pull/1854))
-   Make "Run/debug tests in context" position a link ([#3915](https://github.com/OmniSharp/omnisharp-vscode/pull/3915))
-   Update browser launch regex to support non-default logging frameworks ([#3842](https://github.com/OmniSharp/omnisharp-vscode/pull/3842))

### Emmet support in Razor files

To enable emmet support, add the following to your settings.json:

```json
"emmet.includeLanguages": {
    "aspnetcorerazor": "html"
}
```

### Semantic Highlighting

The C# semantic highlighting support is in preview. To enable, set `editor.semanticHighlighting.enabled` and `csharp.semanticHighlighting.enabled` to `true` in your settings. Semantic highlighting is only provided for code files that are part of the active project.

To really see the difference, try the new Visual Studio 2019 Light and Dark themes with semantic colors that closely match Visual Studio 2019.

### Supported Operating Systems for Debugging

-   Currently, the C# debugger officially supports the following operating systems:

    -   X64 operating systems:
        -   Windows 7 SP1 and newer
        -   macOS 10.12 (Sierra) and newer
        -   Linux: see [.NET Core documentation](https://github.com/dotnet/core/blob/master/release-notes/2.2/2.2-supported-os.md#linux) for the list of supported distributions. Note that other Linux distributions will likely work as well as long as they include glibc and OpenSSL.
    -   ARM operating systems:
        -   Linux is supported as a remote debugging target

### Found a Bug?

To file a new issue to include all the related config information directly from vscode by entering the command pallette with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>
(<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on macOS) and running `CSharp: Report an issue` command. This will open a browser window with all the necessary information related to the installed extensions, dotnet version, mono version, etc. Enter all the remaining information and hit submit. More information can be found on the [wiki](https://github.com/OmniSharp/omnisharp-vscode/wiki/Reporting-Issues).

Alternatively you could visit https://github.com/OmniSharp/omnisharp-vscode/issues and file a new one.

### Development

First install:

-   Node.js (8.11.1 or later)
-   Npm (5.6.0 or later)

To **run and develop** do the following:

-   Run `npm i`
-   Run `npm run compile`
-   Open in Visual Studio Code (`code .`)
-   _Optional:_ run `npm run watch`, make code changes
-   Press <kbd>F5</kbd> to debug

To **test** do the following: `npm run test` or <kbd>F5</kbd> in VS Code with the "Launch Tests" debug configuration.

### License

Copyright © .NET Foundation, and contributors.

The Microsoft C# extension is subject to [these license terms](https://github.com/OmniSharp/omnisharp-vscode/blob/master/RuntimeLicenses/license.txt).
The source code to this extension is available on [https://github.com/OmniSharp/omnisharp-vscode](https://github.com/OmniSharp/omnisharp-vscode) and licensed under the [MIT license](https://github.com/OmniSharp/omnisharp-vscode/blob/master/LICENSE.txt).

## Code of Conduct

This project has adopted the code of conduct defined by the [Contributor Covenant](http://contributor-covenant.org/)
to clarify expected behavior in our community.
For more information see the [.NET Foundation Code of Conduct](http://www.dotnetfoundation.org/code-of-conduct).

## Contribution License Agreement

By signing the [CLA](https://cla.dotnetfoundation.org/OmniSharp/omnisharp-roslyn), the community is free to use your contribution to [.NET Foundation](http://www.dotnetfoundation.org) projects.

## .NET Foundation

This project is supported by the [.NET Foundation](http://www.dotnetfoundation.org).
