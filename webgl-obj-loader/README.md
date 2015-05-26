


<!DOCTYPE html>
<html lang="en" class="">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    
    
    <title>webgl-obj-loader/README.md at master · frenchtoast747/webgl-obj-loader</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="frenchtoast747/webgl-obj-loader" name="twitter:title" /><meta content="webgl-obj-loader - A simple OBJ model loader to help facilitate the learning of WebGL." name="twitter:description" /><meta content="https://avatars0.githubusercontent.com/u/1094000?v=3&amp;s=400" name="twitter:image:src" />
      <meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars0.githubusercontent.com/u/1094000?v=3&amp;s=400" property="og:image" /><meta content="frenchtoast747/webgl-obj-loader" property="og:title" /><meta content="https://github.com/frenchtoast747/webgl-obj-loader" property="og:url" /><meta content="webgl-obj-loader - A simple OBJ model loader to help facilitate the learning of WebGL." property="og:description" />
      <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">
    <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">
    <link rel="assets" href="https://assets-cdn.github.com/">
    <link rel="web-socket" href="wss://live.github.com/_sockets/MjUwOTgwNzo4N2FiMDg2MmNiNDJhZjE2YjJkMjhhMjQ0ZTA2NDAyMzpmOGRmNjQ0NmMwZmI5YTUyMmZlMDYzMTYxYjYzNGQ0MjE3MjFmNjRjMzFmZTVhODgwOTY3ZWYyZjRkY2FhNzE4--e71f167efc5bdba877d4db28eafe0b1502293797">
    <meta name="pjax-timeout" content="1000">
    <link rel="sudo-modal" href="/sessions/sudo_modal">

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>
      <meta name="google-analytics" content="UA-3769691-2">

    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="42D6A160:2D28:85875FA:5563D9E1" name="octolytics-dimension-request_id" /><meta content="2509807" name="octolytics-actor-id" /><meta content="EaterOA" name="octolytics-actor-login" /><meta content="2bebe6f14a2681f478fbf9f17a8defc71afd2a306746bb4b828d391293afdf36" name="octolytics-actor-hash" />
    
    <meta content="Rails, view, blob#show" name="analytics-event" />
    <meta class="js-ga-set" name="dimension1" content="Logged In">
    <meta class="js-ga-set" name="dimension2" content="Header v3">
    <meta name="is-dotcom" content="true">
      <meta name="hostname" content="github.com">
    <meta name="user-login" content="EaterOA">

    
    <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">


    <meta content="authenticity_token" name="csrf-param" />
<meta content="mIehgBzafqvx/BzxU5AfHS6jPpHTduAKmcQ42y82Up++YsA46nh3Qq29pmbqcGaB0m2lBqm/6hJuseIWf8uDag==" name="csrf-token" />

    <link href="https://assets-cdn.github.com/assets/github/index-ec65947a6982ef44ed5617dac5e84463c4b1520f11fdce5e40c3f83efe723ba9.css" media="all" rel="stylesheet" />
    <link href="https://assets-cdn.github.com/assets/github2/index-a0f5520d0defad5e85346a91608065c06ce9333352edbbab61c574c3af400e40.css" media="all" rel="stylesheet" />
    
    


    <meta http-equiv="x-pjax-version" content="d25c70e5f48cb082e6d3e6cb60f816ba">

      
  <meta name="description" content="webgl-obj-loader - A simple OBJ model loader to help facilitate the learning of WebGL.">
  <meta name="go-import" content="github.com/frenchtoast747/webgl-obj-loader git https://github.com/frenchtoast747/webgl-obj-loader.git">

  <meta content="1094000" name="octolytics-dimension-user_id" /><meta content="frenchtoast747" name="octolytics-dimension-user_login" /><meta content="5903702" name="octolytics-dimension-repository_id" /><meta content="frenchtoast747/webgl-obj-loader" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="5903702" name="octolytics-dimension-repository_network_root_id" /><meta content="frenchtoast747/webgl-obj-loader" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/frenchtoast747/webgl-obj-loader/commits/master.atom" rel="alternate" title="Recent Commits to webgl-obj-loader:master" type="application/atom+xml">

  </head>


  <body class="logged_in  env-production linux vis-public page-blob">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
    <div class="wrapper">
      
      
      


        <div class="header header-logged-in true" role="banner">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/" data-hotkey="g d" aria-label="Homepage" data-ga-click="Header, go to dashboard, icon:logo">
  <span class="mega-octicon octicon-mark-github"></span>
</a>


      <div class="site-search repo-scope js-site-search" role="search">
          <form accept-charset="UTF-8" action="/frenchtoast747/webgl-obj-loader/search" class="js-site-search-form" data-global-search-url="/search" data-repo-search-url="/frenchtoast747/webgl-obj-loader/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
  <label class="js-chromeless-input-container form-control">
    <div class="scope-badge">This repository</div>
    <input type="text"
      class="js-site-search-focus js-site-search-field is-clearable chromeless-input"
      data-hotkey="s"
      name="q"
      placeholder="Search"
      data-global-scope-placeholder="Search GitHub"
      data-repo-scope-placeholder="Search"
      tabindex="1"
      autocapitalize="off">
  </label>
</form>
      </div>

      <ul class="header-nav left" role="navigation">
          <li class="header-nav-item explore">
            <a class="header-nav-link" href="/explore" data-ga-click="Header, go to explore, text:explore">Explore</a>
          </li>
            <li class="header-nav-item">
              <a class="header-nav-link" href="https://gist.github.com" data-ga-click="Header, go to gist, text:gist">Gist</a>
            </li>
            <li class="header-nav-item">
              <a class="header-nav-link" href="/blog" data-ga-click="Header, go to blog, text:blog">Blog</a>
            </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="https://help.github.com" data-ga-click="Header, go to help, text:help">Help</a>
          </li>
      </ul>

      
<ul class="header-nav user-nav right" id="user-links">
  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link name" href="/EaterOA" data-ga-click="Header, go to profile, text:username">
      <img alt="@EaterOA" class="avatar" data-user="2509807" height="20" src="https://avatars0.githubusercontent.com/u/2509807?v=3&amp;s=40" width="20" />
      <span class="css-truncate">
        <span class="css-truncate-target">EaterOA</span>
      </span>
    </a>
  </li>

  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link js-menu-target tooltipped tooltipped-s" href="/new" aria-label="Create new..." data-ga-click="Header, create new, icon:add">
      <span class="octicon octicon-plus"></span>
      <span class="dropdown-caret"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      <ul class="dropdown-menu">
        
<li>
  <a href="/new" data-ga-click="Header, create new repository, icon:repo"><span class="octicon octicon-repo"></span> New repository</a>
</li>
<li>
  <a href="/organizations/new" data-ga-click="Header, create new organization, icon:organization"><span class="octicon octicon-organization"></span> New organization</a>
</li>


  <li class="dropdown-divider"></li>
  <li class="dropdown-header">
    <span title="frenchtoast747/webgl-obj-loader">This repository</span>
  </li>
    <li>
      <a href="/frenchtoast747/webgl-obj-loader/issues/new" data-ga-click="Header, create new issue, icon:issue"><span class="octicon octicon-issue-opened"></span> New issue</a>
    </li>

      </ul>
    </div>
  </li>

  <li class="header-nav-item">
      <span class="js-socket-channel js-updatable-content"
        data-channel="notification-changed:EaterOA"
        data-url="/notifications/header">
      <a href="/notifications" aria-label="You have no unread notifications" class="header-nav-link notification-indicator tooltipped tooltipped-s" data-ga-click="Header, go to notifications, icon:read" data-hotkey="g n">
          <span class="mail-status all-read"></span>
          <span class="octicon octicon-inbox"></span>
</a>  </span>

  </li>

  <li class="header-nav-item">
    <a class="header-nav-link tooltipped tooltipped-s" href="/settings/profile" id="account_settings" aria-label="Settings" data-ga-click="Header, go to settings, icon:settings">
      <span class="octicon octicon-gear"></span>
    </a>
  </li>

  <li class="header-nav-item">
    <form accept-charset="UTF-8" action="/logout" class="logout-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="dR+Hn4cibSMjD6bjYNEiVUrt4P/AtQxLNFBDm+7+4MrIyysUKjT7Y2XrpONGRQdki/Uw0Me8KkuA4VVOLuLz9w==" /></div>
      <button class="header-nav-link sign-out-button tooltipped tooltipped-s" aria-label="Sign out" data-ga-click="Header, sign out, icon:logout">
        <span class="octicon octicon-sign-out"></span>
      </button>
</form>  </li>

</ul>



    
  </div>
</div>

        

        


      <div id="start-of-content" class="accessibility-aid"></div>
          <div class="site" itemscope itemtype="http://schema.org/WebPage">
    <div id="js-flash-container">
      
    </div>
    <div class="pagehead repohead instapaper_ignore readability-menu">
      <div class="container">
        
<ul class="pagehead-actions">

  <li>
      <form accept-charset="UTF-8" action="/notifications/subscribe" class="js-social-container" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="xXEGxfpjpj8sLpoQDSD4Ar+CRsGo4riyQNVsx0gCxfL80acVjB1UTKrnl2Kas6x+TjopJhwJCxJ9qFcIMWVgow==" /></div>    <input id="repository_id" name="repository_id" type="hidden" value="5903702" />

      <div class="select-menu js-menu-container js-select-menu">
        <a href="/frenchtoast747/webgl-obj-loader/subscription"
          class="btn btn-sm btn-with-count select-menu-button js-menu-target" role="button" tabindex="0" aria-haspopup="true"
          data-ga-click="Repository, click Watch settings, action:blob#show">
          <span class="js-select-button">
            <span class="octicon octicon-eye"></span>
            Watch
          </span>
        </a>
        <a class="social-count js-social-count" href="/frenchtoast747/webgl-obj-loader/watchers">
          7
        </a>

        <div class="select-menu-modal-holder">
          <div class="select-menu-modal subscription-menu-modal js-menu-content" aria-hidden="true">
            <div class="select-menu-header">
              <span class="select-menu-title">Notifications</span>
              <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
            </div>

            <div class="select-menu-list js-navigation-container" role="menu">

              <div class="select-menu-item js-navigation-item selected" role="menuitem" tabindex="0">
                <span class="select-menu-item-icon octicon octicon-check"></span>
                <div class="select-menu-item-text">
                  <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                  <span class="select-menu-item-heading">Not watching</span>
                  <span class="description">Be notified when participating or @mentioned.</span>
                  <span class="js-select-button-text hidden-select-button-text">
                    <span class="octicon octicon-eye"></span>
                    Watch
                  </span>
                </div>
              </div>

              <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                <span class="select-menu-item-icon octicon octicon octicon-check"></span>
                <div class="select-menu-item-text">
                  <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                  <span class="select-menu-item-heading">Watching</span>
                  <span class="description">Be notified of all conversations.</span>
                  <span class="js-select-button-text hidden-select-button-text">
                    <span class="octicon octicon-eye"></span>
                    Unwatch
                  </span>
                </div>
              </div>

              <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                <span class="select-menu-item-icon octicon octicon-check"></span>
                <div class="select-menu-item-text">
                  <input id="do_ignore" name="do" type="radio" value="ignore" />
                  <span class="select-menu-item-heading">Ignoring</span>
                  <span class="description">Never be notified.</span>
                  <span class="js-select-button-text hidden-select-button-text">
                    <span class="octicon octicon-mute"></span>
                    Stop ignoring
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
</form>
  </li>

  <li>
    
  <div class="js-toggler-container js-social-container starring-container ">

    <form accept-charset="UTF-8" action="/frenchtoast747/webgl-obj-loader/unstar" class="js-toggler-form starred js-unstar-button" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="GvA/sPgdPyVOo1st5qQnOIJxaqf2DQNldT9+pnJLMgVj4XoEEJfFfYCGU7/wjpMKqzRoINmDu8ppmMI0qKR+NQ==" /></div>
      <button
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Unstar this repository" title="Unstar frenchtoast747/webgl-obj-loader"
        data-ga-click="Repository, click unstar button, action:blob#show; text:Unstar">
        <span class="octicon octicon-star"></span>
        Unstar
      </button>
        <a class="social-count js-social-count" href="/frenchtoast747/webgl-obj-loader/stargazers">
          30
        </a>
</form>
    <form accept-charset="UTF-8" action="/frenchtoast747/webgl-obj-loader/star" class="js-toggler-form unstarred js-star-button" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="tm/BktRtKvEyOwTyKXh0DCkVUq5GNLhlfxDcc3yhg8DDnEirsL0tayCJsHwbRLkwbNCAMDdWLdN3KnVAiCK39g==" /></div>
      <button
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Star this repository" title="Star frenchtoast747/webgl-obj-loader"
        data-ga-click="Repository, click star button, action:blob#show; text:Star">
        <span class="octicon octicon-star"></span>
        Star
      </button>
        <a class="social-count js-social-count" href="/frenchtoast747/webgl-obj-loader/stargazers">
          30
        </a>
</form>  </div>

  </li>

        <li>
          <a href="#fork-destination-box" class="btn btn-sm btn-with-count"
              title="Fork your own copy of frenchtoast747/webgl-obj-loader to your account"
              aria-label="Fork your own copy of frenchtoast747/webgl-obj-loader to your account"
              rel="facebox"
              data-ga-click="Repository, show fork modal, action:blob#show; text:Fork">
            <span class="octicon octicon-repo-forked"></span>
            Fork
          </a>
          <a href="/frenchtoast747/webgl-obj-loader/network" class="social-count">10</a>

          <div id="fork-destination-box" style="display: none;">
            <h2 class="facebox-header">Where should we fork this repository?</h2>
            <include-fragment src=""
                class="js-fork-select-fragment fork-select-fragment"
                data-url="/frenchtoast747/webgl-obj-loader/fork?fragment=1">
              <img alt="Loading" height="64" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-128-338974454bb5c32803e82f601beb051d373744b024fe8742a76009700fd7e033.gif" width="64" />
            </include-fragment>
          </div>
        </li>

</ul>

        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="mega-octicon octicon-repo"></span>
          <span class="author"><a href="/frenchtoast747" class="url fn" itemprop="url" rel="author"><span itemprop="title">frenchtoast747</span></a></span><!--
       --><span class="path-divider">/</span><!--
       --><strong><a href="/frenchtoast747/webgl-obj-loader" class="js-current-repository" data-pjax="#js-repo-pjax-container">webgl-obj-loader</a></strong>

          <span class="page-context-loader">
            <img alt="" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->

    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline  ">
        <div class="repository-sidebar clearfix">
            
<nav class="sunken-menu repo-nav js-repo-nav js-sidenav-container-pjax js-octicon-loaders"
     role="navigation"
     data-pjax="#js-repo-pjax-container"
     data-issue-count-url="/frenchtoast747/webgl-obj-loader/issues/counts">
  <ul class="sunken-menu-group">
    <li class="tooltipped tooltipped-w" aria-label="Code">
      <a href="/frenchtoast747/webgl-obj-loader" aria-label="Code" class="selected js-selected-navigation-item sunken-menu-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /frenchtoast747/webgl-obj-loader">
        <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
</a>    </li>

      <li class="tooltipped tooltipped-w" aria-label="Issues">
        <a href="/frenchtoast747/webgl-obj-loader/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /frenchtoast747/webgl-obj-loader/issues">
          <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
          <span class="js-issue-replace-counter"></span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
</a>      </li>

    <li class="tooltipped tooltipped-w" aria-label="Pull requests">
      <a href="/frenchtoast747/webgl-obj-loader/pulls" aria-label="Pull requests" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g p" data-selected-links="repo_pulls /frenchtoast747/webgl-obj-loader/pulls">
          <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull requests</span>
          <span class="js-pull-replace-counter"></span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
</a>    </li>

      <li class="tooltipped tooltipped-w" aria-label="Wiki">
        <a href="/frenchtoast747/webgl-obj-loader/wiki" aria-label="Wiki" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g w" data-selected-links="repo_wiki /frenchtoast747/webgl-obj-loader/wiki">
          <span class="octicon octicon-book"></span> <span class="full-word">Wiki</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
</a>      </li>
  </ul>
  <div class="sunken-menu-separator"></div>
  <ul class="sunken-menu-group">

    <li class="tooltipped tooltipped-w" aria-label="Pulse">
      <a href="/frenchtoast747/webgl-obj-loader/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-selected-links="pulse /frenchtoast747/webgl-obj-loader/pulse">
        <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
</a>    </li>

    <li class="tooltipped tooltipped-w" aria-label="Graphs">
      <a href="/frenchtoast747/webgl-obj-loader/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-selected-links="repo_graphs repo_contributors /frenchtoast747/webgl-obj-loader/graphs">
        <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
</a>    </li>
  </ul>


</nav>

              <div class="only-with-full-nav">
                  
<div class="clone-url open"
  data-protocol-type="http"
  data-url="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone">
  <h3><span class="text-emphasized">HTTPS</span> clone URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
           value="https://github.com/frenchtoast747/webgl-obj-loader.git" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="clone-url "
  data-protocol-type="ssh"
  data-url="/users/set_protocol?protocol_selector=ssh&amp;protocol_type=clone">
  <h3><span class="text-emphasized">SSH</span> clone URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
           value="git@github.com:frenchtoast747/webgl-obj-loader.git" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="clone-url "
  data-protocol-type="subversion"
  data-url="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone">
  <h3><span class="text-emphasized">Subversion</span> checkout URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
           value="https://github.com/frenchtoast747/webgl-obj-loader" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>



<p class="clone-options">You can clone with
  <a href="#" class="js-clone-selector" data-protocol="http">HTTPS</a>, <a href="#" class="js-clone-selector" data-protocol="ssh">SSH</a>, or <a href="#" class="js-clone-selector" data-protocol="subversion">Subversion</a>.
  <a href="https://help.github.com/articles/which-remote-url-should-i-use" class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
    <span class="octicon octicon-question"></span>
  </a>
</p>




                <a href="/frenchtoast747/webgl-obj-loader/archive/master.zip"
                   class="btn btn-sm sidebar-button"
                   aria-label="Download the contents of frenchtoast747/webgl-obj-loader as a zip file"
                   title="Download the contents of frenchtoast747/webgl-obj-loader as a zip file"
                   rel="nofollow">
                  <span class="octicon octicon-cloud-download"></span>
                  Download ZIP
                </a>
              </div>
        </div><!-- /.repository-sidebar -->

        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>

          

<a href="/frenchtoast747/webgl-obj-loader/blob/59ae3b75eb0fd136e02a29a1522884e10920addc/README.md" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

<!-- blob contrib key: blob_contributors:v21:72c74e4f49316f3d7b32415b77a331ca -->

<div class="file-navigation js-zeroclipboard-container">
  
<div class="select-menu js-menu-container js-select-menu left">
  <span class="btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
    data-master-branch="master"
    data-ref="master"
    title="master"
    role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <span class="octicon octicon-git-branch"></span>
    <i>branch:</i>
    <span class="js-select-button css-truncate-target">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
      </div>

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab">Tags</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/frenchtoast747/webgl-obj-loader/blob/development/README.md"
               data-name="development"
               data-skip-pjax="true"
               rel="nofollow">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <span class="select-menu-item-text css-truncate-target" title="development">
                development
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/frenchtoast747/webgl-obj-loader/blob/gh-pages/README.md"
               data-name="gh-pages"
               data-skip-pjax="true"
               rel="nofollow">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <span class="select-menu-item-text css-truncate-target" title="gh-pages">
                gh-pages
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open selected"
               href="/frenchtoast747/webgl-obj-loader/blob/master/README.md"
               data-name="master"
               data-skip-pjax="true"
               rel="nofollow">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <span class="select-menu-item-text css-truncate-target" title="master">
                master
              </span>
            </a>
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/frenchtoast747/webgl-obj-loader/tree/v0.1.1/README.md"
                 data-name="v0.1.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v0.1.1">v0.1.1</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/frenchtoast747/webgl-obj-loader/tree/v0.1.0/README.md"
                 data-name="v0.1.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v0.1.0">v0.1.0</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/frenchtoast747/webgl-obj-loader/tree/v0.0.3/README.md"
                 data-name="v0.0.3"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v0.0.3">v0.0.3</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/frenchtoast747/webgl-obj-loader/tree/v0.0.2/README.md"
                 data-name="v0.0.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v0.0.2">v0.0.2</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/frenchtoast747/webgl-obj-loader/tree/v0.0.1/README.md"
                 data-name="v0.0.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v0.0.1">v0.0.1</a>
            </div>
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div>

    </div>
  </div>
</div>

  <div class="btn-group right">
    <a href="/frenchtoast747/webgl-obj-loader/find/master"
          class="js-show-file-finder btn btn-sm empty-icon tooltipped tooltipped-s"
          data-pjax
          data-hotkey="t"
          aria-label="Quickly jump between files">
      <span class="octicon octicon-list-unordered"></span>
    </a>
    <button aria-label="Copy file path to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
  </div>

  <div class="breadcrumb js-zeroclipboard-target">
    <span class='repo-root js-repo-root'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/frenchtoast747/webgl-obj-loader" class="" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">webgl-obj-loader</span></a></span></span><span class="separator">/</span><strong class="final-path">README.md</strong>
  </div>
</div>


  <div class="commit file-history-tease">
    <div class="file-history-tease-header">
        <img alt="@frenchtoast747" class="avatar" data-user="1094000" height="24" src="https://avatars2.githubusercontent.com/u/1094000?v=3&amp;s=48" width="24" />
        <span class="author"><a href="/frenchtoast747" rel="author">frenchtoast747</a></span>
        <time datetime="2014-10-22T19:07:12Z" is="relative-time">Oct 22, 2014</time>
        <div class="commit-title">
            <a href="/frenchtoast747/webgl-obj-loader/commit/a3a8e812921bb3526c99b118b2e727804c794fd0" class="message" data-pjax="true" title="Bump version">Bump version</a>
        </div>
    </div>

    <div class="participation">
      <p class="quickstat">
        <a href="#blob_contributors_box" rel="facebox">
          <strong>4</strong>
           contributors
        </a>
      </p>
          <a class="avatar-link tooltipped tooltipped-s" aria-label="frenchtoast747" href="/frenchtoast747/webgl-obj-loader/commits/master/README.md?author=frenchtoast747"><img alt="@frenchtoast747" class="avatar" data-user="1094000" height="20" src="https://avatars0.githubusercontent.com/u/1094000?v=3&amp;s=40" width="20" /> </a>
    <a class="avatar-link tooltipped tooltipped-s" aria-label="nickdesaulniers" href="/frenchtoast747/webgl-obj-loader/commits/master/README.md?author=nickdesaulniers"><img alt="@nickdesaulniers" class="avatar" data-user="1823839" height="20" src="https://avatars3.githubusercontent.com/u/1823839?v=3&amp;s=40" width="20" /> </a>
    <a class="avatar-link tooltipped tooltipped-s" aria-label="bitdeli-chef" href="/frenchtoast747/webgl-obj-loader/commits/master/README.md?author=bitdeli-chef"><img alt="@bitdeli-chef" class="avatar" data-user="3092978" height="20" src="https://avatars0.githubusercontent.com/u/3092978?v=3&amp;s=40" width="20" /> </a>
    <a class="avatar-link tooltipped tooltipped-s" aria-label="shaneallgeier" href="/frenchtoast747/webgl-obj-loader/commits/master/README.md?author=shaneallgeier"><img alt="@shaneallgeier" class="avatar" data-user="1827786" height="20" src="https://avatars1.githubusercontent.com/u/1827786?v=3&amp;s=40" width="20" /> </a>


    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list">
          <li class="facebox-user-list-item">
            <img alt="@frenchtoast747" data-user="1094000" height="24" src="https://avatars2.githubusercontent.com/u/1094000?v=3&amp;s=48" width="24" />
            <a href="/frenchtoast747">frenchtoast747</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="@nickdesaulniers" data-user="1823839" height="24" src="https://avatars1.githubusercontent.com/u/1823839?v=3&amp;s=48" width="24" />
            <a href="/nickdesaulniers">nickdesaulniers</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="@bitdeli-chef" data-user="3092978" height="24" src="https://avatars2.githubusercontent.com/u/3092978?v=3&amp;s=48" width="24" />
            <a href="/bitdeli-chef">bitdeli-chef</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="@shaneallgeier" data-user="1827786" height="24" src="https://avatars3.githubusercontent.com/u/1827786?v=3&amp;s=48" width="24" />
            <a href="/shaneallgeier">shaneallgeier</a>
          </li>
      </ul>
    </div>
  </div>

<div class="file">
  <div class="file-header">
    <div class="file-actions">

      <div class="btn-group">
        <a href="/frenchtoast747/webgl-obj-loader/raw/master/README.md" class="btn btn-sm " id="raw-url">Raw</a>
          <a href="/frenchtoast747/webgl-obj-loader/blame/master/README.md" class="btn btn-sm js-update-url-with-hash">Blame</a>
        <a href="/frenchtoast747/webgl-obj-loader/commits/master/README.md" class="btn btn-sm " rel="nofollow">History</a>
      </div>


            <form accept-charset="UTF-8" action="/frenchtoast747/webgl-obj-loader/edit/master/README.md" class="inline-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="EhOyvAvVrKQeRQmWs9WZoLyD7c6yP45F+sp12pwy0AZTBDYGNO3mSIwIqhOrfrwIHT+SW4bG5XESvQQiePknRA==" /></div>
              <button class="octicon-btn tooltipped tooltipped-n" type="submit" aria-label="Fork this project and edit the file" data-hotkey="e" data-disable-with>
                <span class="octicon octicon-pencil"></span>
              </button>
</form>
          <form accept-charset="UTF-8" action="/frenchtoast747/webgl-obj-loader/delete/master/README.md" class="inline-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="ZgJLNtNGllGOYN83aMdYdElXtJ3W8sRC9RRETW3qT8m9iqeZhA6kJhESmSiVAZu0RGqiuiK3Ev3RIR/Fgi7hFw==" /></div>
            <button class="octicon-btn octicon-btn-danger tooltipped tooltipped-n" type="submit" aria-label="Fork this project and delete this file" data-disable-with>
              <span class="octicon octicon-trashcan"></span>
            </button>
</form>    </div>

    <div class="file-info">
        259 lines (207 sloc)
        <span class="file-info-divider"></span>
      10.106 kb
    </div>
  </div>
    <div id="readme" class="blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1><a id="user-content-webgl-obj-loader" class="anchor" href="#webgl-obj-loader" aria-hidden="true"><span class="octicon octicon-link"></span></a>webgl-obj-loader</h1>

<p>A simple script to help bring OBJ models to your WebGL world. I originally
wrote this script for my CS Graphics class so that we didn't have to only have
cubes and spheres for models in order to learn WebGL. At the time, the only
sort of model loader for WebGL was <a href="http://threejs.org/">Mr. Doob's ThreeJS</a>. And in order to use the
loaders you had to use the entire framework (or do some very serious hacking
and duct-taping in order get the model information). My main focus in creating
this loader was to easily allow importing models without having to have special
knowledge of a 3D graphics program (like Blender) while keeping it low-level
enough so that the focus was on learning WebGL rather than learning some
framework.</p>

<h2><a id="user-content-meshobjstr" class="anchor" href="#meshobjstr" aria-hidden="true"><span class="octicon octicon-link"></span></a>Mesh(objStr)</h2>

<p>The main Mesh class. The constructor will parse through the OBJ file data
and collect the vertex, vertex normal, texture, and face information. This
information can then be used later on when creating your VBOs. Look at the
<code>initMeshBuffers</code> source for an example of how to use the newly created Mesh</p>

<h3><a id="user-content-attributes" class="anchor" href="#attributes" aria-hidden="true"><span class="octicon octicon-link"></span></a>Attributes:</h3>

<ul>
<li><strong>vertices:</strong> an array containing the vertex values that correspond to each unique face index. The array is flat in that each vertex's component is an element of the array. For example: with <code>verts = [1, -1, 1, ...]</code>, <code>verts[0] is x</code>, <code>verts[1] is y</code>, and <code>verts[2] is z</code>. Continuing on, <code>verts[3]</code> would be the beginning of the next vertex: its x component. This is in preparation for using <code>gl.ELEMENT_ARRAY_BUFFER</code> for the <code>gl.drawElements</code> call.</li>
<li><strong>vertexNormals:</strong> an array containing the vertex normals that correspond to each unique face index. It is flat, just like <code>vertices</code>.</li>
<li><strong>textures:</strong> an array containing the <code>s</code> and <code>t</code> (or <code>u</code> and <code>v</code>) coordinates for this mesh's texture. It is flat just like <code>vertices</code> except it goes by groups of 2 instead of 3.</li>
<li><strong>indices:</strong> an array containing the indicies to be used in conjunction with the above three arrays in order to draw the triangles that make up faces. For example, <code>indices[42]</code> could contain the number <code>38</code>. This would then be used internally by WebGL on all three of the above arrays telling which vertex, normal, and texture coords to use: <code>vertices[38]</code>, <code>vertexNormals[38]</code>, and <code>textures[38]</code>.</li>
</ul>

<h3><a id="user-content-params" class="anchor" href="#params" aria-hidden="true"><span class="octicon octicon-link"></span></a>Params:</h3>

<ul>
<li><strong>objStr</strong> a string representation of an OBJ file with newlines preserved.</li>
</ul>

<p>A simple example:</p>

<p>In your <code>index.html</code> file:</p>

<div class="highlight highlight-html"><pre>&lt;<span class="pl-ent">html</span>&gt;
    &lt;<span class="pl-ent">head</span>&gt;
        &lt;<span class="pl-ent">script</span> <span class="pl-e">type</span>=<span class="pl-s"><span class="pl-pds">"</span>text/plain<span class="pl-pds">"</span></span> <span class="pl-e">id</span>=<span class="pl-s"><span class="pl-pds">"</span>my_cube.obj<span class="pl-pds">"</span></span>&gt;
            ####
            #
            #   OBJ File Generated by Blender
            #
            ####
            o my_cube.obj
            v 1 1 1
            v -1 1 1
            v -1 -1 1
            v 1 -1 1
            v 1 1 -1
            v -1 1 -1
            v -1 -1 -1
            v 1 -1 -1
            vn 0 0 1
            vn 1 0 0
            vn -1 0 0
            vn 0 0 -1
            vn 0 1 0
            vn 0 -1 0
            f 1//1 2//1 3//1
            f 3//1 4//1 1//1
            f 5//2 1//2 4//2
            f 4//2 8//2 5//2
            f 2//3 6//3 7//3
            f 7//3 3//3 2//3
            f 7//4 8//4 5//4
            f 5//4 6//4 7//4
            f 5//5 6//5 2//5
            f 2//5 1//5 5//5
            f 8//6 4//6 3//6
            f 3//6 7//6 8//6
        &lt;/<span class="pl-ent">script</span>&gt;
    &lt;/<span class="pl-ent">head</span>&gt;
&lt;/<span class="pl-ent">html</span>&gt;</pre></div>

<p>And in your <code>app.js</code>:</p>

<div class="highlight highlight-javascript"><pre><span class="pl-k">var</span> gl <span class="pl-k">=</span> canvas.getContext(<span class="pl-s"><span class="pl-pds">'</span>webgl<span class="pl-pds">'</span></span>);
<span class="pl-k">var</span> objStr <span class="pl-k">=</span> <span class="pl-c1">document</span>.<span class="pl-c1">getElementById</span>(<span class="pl-s"><span class="pl-pds">'</span>my_cube.obj<span class="pl-pds">'</span></span>).innerHTML;
<span class="pl-k">var</span> mesh <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">OBJ.Mesh</span>(objStr);

<span class="pl-c">// use the included helper function to initialize the VBOs</span>
<span class="pl-c">// if you don't want to use this function, have a look at its</span>
<span class="pl-c">// source to see how to use the Mesh instance.</span>
<span class="pl-c1">OBJ</span>.initMeshBuffers(gl, mesh);
<span class="pl-c">// have a look at the initMeshBuffers docs for an exmample of how to</span>
<span class="pl-c">// render the model at this point</span>
</pre></div>

<h2><a id="user-content-some-helper-functions" class="anchor" href="#some-helper-functions" aria-hidden="true"><span class="octicon octicon-link"></span></a>Some helper functions</h2>

<h3><a id="user-content-downloadmeshesnameandurls-completioncallback-meshes" class="anchor" href="#downloadmeshesnameandurls-completioncallback-meshes" aria-hidden="true"><span class="octicon octicon-link"></span></a>downloadMeshes(nameAndURLs, completionCallback, meshes)</h3>

<p>Takes in a JS Object of <code>mesh_name</code>, <code>'/url/to/OBJ/file'</code> pairs and a callback
function. Each OBJ file will be ajaxed in and automatically converted to
an OBJ.Mesh. When all files have successfully downloaded the callback
function provided will be called and passed in an object containing
the newly created meshes.</p>

<p><strong>Note:</strong> In order to use this function as a way to download meshes, a
webserver of some sort must be used.</p>

<h4><a id="user-content-params-1" class="anchor" href="#params-1" aria-hidden="true"><span class="octicon octicon-link"></span></a>Params:</h4>

<ul>
<li><p><strong>nameAndURLs:</strong> an object where the key is the name of the mesh and the value is the url to that mesh's OBJ file</p></li>
<li><p><strong>completionCallback:</strong> should contain a function that will take one parameter: an object array where the keys will be the unique object name and the value will be a Mesh object</p></li>
<li><p><strong>meshes:</strong> In case other meshes are loaded separately or if a previously declared variable is desired to be used, pass in a (possibly empty) json object of the pattern: <code>{ 'mesh_name': OBJ.Mesh }</code></p></li>
</ul>

<p>A simple example:</p>

<div class="highlight highlight-javascript"><pre><span class="pl-k">var</span> app <span class="pl-k">=</span> {};
    app.meshes <span class="pl-k">=</span> {};

<span class="pl-k">var</span> gl <span class="pl-k">=</span> <span class="pl-c1">document</span>.<span class="pl-c1">getElementById</span>(<span class="pl-s"><span class="pl-pds">'</span>mycanvas<span class="pl-pds">'</span></span>).getContext(<span class="pl-s"><span class="pl-pds">'</span>webgl<span class="pl-pds">'</span></span>);

<span class="pl-k">function</span> <span class="pl-en">webGLStart</span>(<span class="pl-smi">meshes</span>){
  app.meshes <span class="pl-k">=</span> meshes;
  <span class="pl-c">// initialize the VBOs</span>
  <span class="pl-c1">OBJ</span>.initMeshBuffers(gl, app.meshes.suzanne);
  <span class="pl-c1">OBJ</span>.initMeshBuffers(gl, app.meshes.sphere);
  ... other cool stuff ...
  <span class="pl-c">// refer to the initMeshBuffers docs for an example of</span>
  <span class="pl-c">// how to render the mesh to the screen after calling</span>
  <span class="pl-c">// initMeshBuffers</span>
}

<span class="pl-c1">window</span>.<span class="pl-en">onload</span> <span class="pl-k">=</span> <span class="pl-k">function</span>(){
  <span class="pl-c1">OBJ</span>.downloadMeshes({
    <span class="pl-s"><span class="pl-pds">'</span>suzanne<span class="pl-pds">'</span></span><span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">'</span>models/suzanne.obj<span class="pl-pds">'</span></span>, <span class="pl-c">// located in the models folder on the server</span>
    <span class="pl-s"><span class="pl-pds">'</span>sphere<span class="pl-pds">'</span></span><span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">'</span>models/sphere.obj<span class="pl-pds">'</span></span>
  }, webGLStart);
}</pre></div>

<h3><a id="user-content-initmeshbuffersgl-mesh" class="anchor" href="#initmeshbuffersgl-mesh" aria-hidden="true"><span class="octicon octicon-link"></span></a>initMeshBuffers(gl, mesh)</h3>

<p>Takes in the WebGL context and a Mesh, then creates and appends the buffers
to the mesh object as attributes.</p>

<h4><a id="user-content-params-2" class="anchor" href="#params-2" aria-hidden="true"><span class="octicon octicon-link"></span></a>Params:</h4>

<ul>
<li><p><strong>gl</strong> <em>WebGLRenderingContext</em> the <code>canvas.getContext('webgl')</code> context instance</p></li>
<li><p><strong>mesh</strong> <em>Mesh</em> a single <code>OBJ.Mesh</code> instance</p></li>
</ul>

<p>The newly created mesh attributes are:</p>

<table><thead>
<tr>
<th align="left">Attrbute</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td align="left"><strong>normalBuffer</strong></td>
<td>contains the model's Vertex Normals</td>
</tr>
<tr>
<td align="left">normalBuffer.itemSize</td>
<td>set to 3 items</td>
</tr>
<tr>
<td align="left">normalBuffer.numItems</td>
<td>the total number of vertex normals</td>
</tr>
<tr>
<td align="left"><strong>textureBuffer</strong></td>
<td>contains the model's Texture Coordinates</td>
</tr>
<tr>
<td align="left">textureBuffer.itemSize</td>
<td>set to 2 items</td>
</tr>
<tr>
<td align="left">textureBuffer.numItems</td>
<td>the number of texture coordinates</td>
</tr>
<tr>
<td align="left"><strong>vertexBuffer</strong></td>
<td>contains the model's Vertex Position Coordinates (does not include w)</td>
</tr>
<tr>
<td align="left">vertexBuffer.itemSize</td>
<td>set to 3 items</td>
</tr>
<tr>
<td align="left">vertexBuffer.numItems</td>
<td>the total number of vertices</td>
</tr>
<tr>
<td align="left"><strong>indexBuffer</strong></td>
<td>contains the indices of the faces</td>
</tr>
<tr>
<td align="left">indexBuffer.itemSize</td>
<td>is set to 1</td>
</tr>
<tr>
<td align="left">indexBuffer.numItems</td>
<td>the total number of indices</td>
</tr>
</tbody></table>

<p>A simple example (a lot of steps are missing, so don't copy and paste):</p>

<div class="highlight highlight-javascript"><pre><span class="pl-k">var</span> gl   <span class="pl-k">=</span> canvas.getContext(<span class="pl-s"><span class="pl-pds">'</span>webgl<span class="pl-pds">'</span></span>),
<span class="pl-k">var</span> mesh <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">OBJ.Mesh</span>(obj_file_data);
<span class="pl-c">// compile the shaders and create a shader program</span>
<span class="pl-k">var</span> shaderProgram <span class="pl-k">=</span> gl.createProgram();
<span class="pl-c">// compilation stuff here</span>
...
<span class="pl-c">// make sure you have vertex, vertex normal, and texture coordinate</span>
<span class="pl-c">// attributes located in your shaders and attach them to the shader program</span>
shaderProgram.vertexPositionAttribute <span class="pl-k">=</span> gl.getAttribLocation(shaderProgram, <span class="pl-s"><span class="pl-pds">"</span>aVertexPosition<span class="pl-pds">"</span></span>);
gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

shaderProgram.vertexNormalAttribute <span class="pl-k">=</span> gl.getAttribLocation(shaderProgram, <span class="pl-s"><span class="pl-pds">"</span>aVertexNormal<span class="pl-pds">"</span></span>);
gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

shaderProgram.textureCoordAttribute <span class="pl-k">=</span> gl.getAttribLocation(shaderProgram, <span class="pl-s"><span class="pl-pds">"</span>aTextureCoord<span class="pl-pds">"</span></span>);
gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

<span class="pl-c">// create and initialize the vertex, vertex normal, and texture coordinate buffers</span>
<span class="pl-c">// and save on to the mesh object</span>
<span class="pl-c1">OBJ</span>.initMeshBuffers(gl, mesh);

<span class="pl-c">// now to render the mesh</span>
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, gl.FLOAT, <span class="pl-c1">false</span>, <span class="pl-c1">0</span>, <span class="pl-c1">0</span>);

<span class="pl-c">// it's possible that the mesh doesn't contain</span>
<span class="pl-c">// any texture coordinates (e.g. suzanne.obj in the development branch).</span>
<span class="pl-c">// in this case, the texture vertexAttribArray will need to be disabled</span>
<span class="pl-c">// before the call to drawElements</span>
<span class="pl-k">if</span>(<span class="pl-k">!</span>mesh.textures.<span class="pl-c1">length</span>){
  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
}
<span class="pl-k">else</span>{
  <span class="pl-c">// if the texture vertexAttribArray has been previously</span>
  <span class="pl-c">// disabled, then it needs to be re-enabled</span>
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, <span class="pl-c1">false</span>, <span class="pl-c1">0</span>, <span class="pl-c1">0</span>);
}

gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, gl.FLOAT, <span class="pl-c1">false</span>, <span class="pl-c1">0</span>, <span class="pl-c1">0</span>);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, <span class="pl-c1">0</span>);</pre></div>

<h3><a id="user-content-deletemeshbuffersgl-mesh" class="anchor" href="#deletemeshbuffersgl-mesh" aria-hidden="true"><span class="octicon octicon-link"></span></a>deleteMeshBuffers(gl, mesh)</h3>

<p>Deletes the mesh's buffers, which you would do when deleting an object from a
scene so that you don't leak video memory.  Excessive buffer creation and
deletion leads to video memory fragmentation.  Beware.</p>

<h2><a id="user-content-nodejs" class="anchor" href="#nodejs" aria-hidden="true"><span class="octicon octicon-link"></span></a>Node.js</h2>

<p><code>npm install webgl-obj-loader</code></p>

<div class="highlight highlight-javascript"><pre><span class="pl-k">var</span> fs <span class="pl-k">=</span> <span class="pl-c1">require</span>(<span class="pl-s"><span class="pl-pds">'</span>fs<span class="pl-pds">'</span></span>);
<span class="pl-k">var</span> <span class="pl-c1">OBJ</span> <span class="pl-k">=</span> <span class="pl-c1">require</span>(<span class="pl-s"><span class="pl-pds">'</span>webgl-obj-loader<span class="pl-pds">'</span></span>);

<span class="pl-k">var</span> meshPath <span class="pl-k">=</span> <span class="pl-s"><span class="pl-pds">'</span>./development/models/sphere.obj<span class="pl-pds">'</span></span>;
<span class="pl-k">var</span> opt <span class="pl-k">=</span> { encoding<span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">'</span>utf8<span class="pl-pds">'</span></span> };

fs.readFile(meshPath, opt, <span class="pl-k">function</span> (<span class="pl-smi">err</span>, <span class="pl-smi">data</span>){
  <span class="pl-k">if</span> (err) <span class="pl-k">return</span> <span class="pl-en">console</span><span class="pl-c1">.error</span>(err);
  <span class="pl-k">var</span> mesh <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">OBJ.Mesh</span>(data);
});</pre></div>

<h2><a id="user-content-demo" class="anchor" href="#demo" aria-hidden="true"><span class="octicon octicon-link"></span></a>Demo</h2>

<p><a href="http://frenchtoast747.github.com/webgl-obj-loader/">http://frenchtoast747.github.com/webgl-obj-loader/</a>
This demo is the same thing inside of the gh-pages branch. Do a <code>git checkout gh-pages</code> inside of the webgl-obj-loader directory to see how the OBJ loader is used in a project.</p>

<h2><a id="user-content-changelog" class="anchor" href="#changelog" aria-hidden="true"><span class="octicon octicon-link"></span></a>ChangeLog</h2>

<p><strong>0.1.1</strong></p>

<ul>
<li>Support for NodeJS.</li>
</ul>

<p><strong>0.1.0</strong></p>

<ul>
<li>Dropped jQuery dependency: <code>downloadMeshes</code> no longer requires jQuery to ajax in the OBJ files.</li>
<li>changed namespace to something a little shorter: <code>OBJ</code></li>
<li>Updated documentation</li>
</ul>

<p><strong>0.0.3</strong></p>

<ul>
<li>Initial support for Quad models</li>
</ul>

<p><strong>0.0.2</strong></p>

<ul>
<li>Texture Coordinates are now loaded into mesh.textures</li>
</ul>

<p><strong>0.0.1</strong></p>

<ul>
<li>Vertex Normals are now loaded into mesh.vertexNormals</li>
</ul>

<p><a href="https://bitdeli.com/free" title="Bitdeli Badge"><img src="https://camo.githubusercontent.com/f801ec3db0b3d6fbd5df9e94b9f260f356b708ae/68747470733a2f2f64327765637a68766c38323376302e636c6f756466726f6e742e6e65742f6672656e6368746f6173743734372f776562676c2d6f626a2d6c6f616465722f7472656e642e706e67" alt="Bitdeli Badge" data-canonical-src="https://d2weczhvl823v0.cloudfront.net/frenchtoast747/webgl-obj-loader/trend.png" style="max-width:100%;"></a></p>
</article>
  </div>

</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <form accept-charset="UTF-8" action="" class="js-jump-to-line-form" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" autofocus>
    <button type="submit" class="btn">Go</button>
</form></div>

        </div>

      </div><!-- /.repo-container -->
      <div class="modal-backdrop"></div>
    </div><!-- /.container -->
  </div><!-- /.site -->


    </div><!-- /.wrapper -->

      <div class="container">
  <div class="site-footer" role="contentinfo">
    <ul class="site-footer-links right">
        <li><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
      <li><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
      <li><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
      <li><a href="https://shop.github.com" data-ga-click="Footer, go to shop, text:shop">Shop</a></li>
        <li><a href="https://github.com/blog" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
        <li><a href="https://github.com/about" data-ga-click="Footer, go to about, text:about">About</a></li>

    </ul>

    <a href="https://github.com" aria-label="Homepage">
      <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
</a>
    <ul class="site-footer-links">
      <li>&copy; 2015 <span title="0.06039s from github-fe133-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="https://github.com/site/terms" data-ga-click="Footer, go to terms, text:terms">Terms</a></li>
        <li><a href="https://github.com/site/privacy" data-ga-click="Footer, go to privacy, text:privacy">Privacy</a></li>
        <li><a href="https://github.com/security" data-ga-click="Footer, go to security, text:security">Security</a></li>
        <li><a href="https://github.com/contact" data-ga-click="Footer, go to contact, text:contact">Contact</a></li>
    </ul>
  </div>
</div>


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-suggester-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="fullscreen-contents js-fullscreen-contents" placeholder=""></textarea>
      <div class="suggester-container">
        <div class="suggester fullscreen-suggester js-suggester js-navigation-container"></div>
      </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped tooltipped-w" aria-label="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped tooltipped-w"
      aria-label="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    

    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <a href="#" class="octicon octicon-x flash-close js-ajax-error-dismiss" aria-label="Dismiss error"></a>
      Something went wrong with that request. Please try again.
    </div>


      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/frameworks-447ce66a36506ebddc8e84b4e32a77f6062f3d3482e77dd21a77a01f0643ad98.js"></script>
      <script async="async" crossorigin="anonymous" src="https://assets-cdn.github.com/assets/github/index-6463092fd81f779e2203f0305a794f3943e9be1a76ec8b98865160d2d69df910.js"></script>
      
      
  </body>
</html>

