<style lang="less" scoped>
  nav.navbar.navbar-default {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    border-bottom: none;

    .navbar-brand {
      padding: 4px;
      margin: 0;
      margin-right: 16px;

      img {
        height: 40px;
        width: auto;
      }
    }

    .nav.navbar-nav {
      li a {
        cursor: pointer;
        text-transform: uppercase;
      }

      li.v-link-active {
        a,
        a:hover,
        a:focus {
          color: #34495e;
          background: linear-gradient(to bottom, #ecf0f1 85%, #34495e 15%);
        }
      }

      a.logout {
        font-weight: bold;
        color: #ff3366;
      }

      a[href="info"] {
        text-transform: capitalize;
      }
    }

    .info {
      padding-left: 16px;
      padding-right: 16px;

      p {
        color: #37375A;
        line-height: 100%;
        margin: 16px 0;
      }
    }
  }
</style>

<template>
  <div>
    <nav class="navbar navbar-default navbar-fixed-top" v-if="show">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>

          <div class="navbar-brand">
            <img alt="condor" class="img-responsive" src="./../../static/images/condor.png">
          </div>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="menu">
          <ul class="nav navbar-nav">
            <li v-link="{name: 'one'}"><a>one</a></li>
            <li v-link="{name: 'two'}"><a>two</a></li>
            <li v-link="{name: 'components'}"><a>components</a></li>
          </ul>

          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              <a href="info"
                 class="dropdown-toggle"
                 data-toggle="dropdown"
                 role="button"
                 aria-haspopup="true"
                 aria-expanded="false"><bool-circle :bool="connection" size="18px"></bool-circle>&nbsp;&nbsp;Account</span>&nbsp;&nbsp;<span class="fa fa-chevron-down"></span></a>
              <ul class="dropdown-menu">
                <li>
                  <div class="info">
                    <p v-text="user.user_full_name"></p>
                    <p v-text="user.user_username"></p>
                    <p>{{ user.user_group.user_group_name }}&nbsp;&nbsp;<bool-circle :bool="user.user_group.user_group_status" size="14px"></bool-circle></p>
                  </div>
                </li>
                <li role="separator" class="divider"></li>
                <li><a @click.prevent="logout" class="logout">logout&nbsp;&nbsp;<i class="fa fa-sign-out"></i></a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import $ from 'jquery';
  require('bootstrap/js/collapse');
  require('bootstrap/js/dropdown');
  require('bootstrap/js/transition');

  module.exports = {
    name: 'navbar',
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: false,
        default: false
      },
      connection: {
        type: Boolean,
        required: true,
        twoWay: false,
        default: false
      },
      user: {
        type: Object,
        required: true,
        twoWay: false,
        default() {return {};}
      }
    },
    ready() {
      $('.dropdown-toggle').dropdown();
    },
    methods: {
      logout() {
        this.$emit('logout');
      }
    }
  };
</script>
