import React, { memo, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useHistory, useParams } from 'react-router-dom';
import { AppContext } from 'src/App';
import cookie from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    '& header': {
      boxShadow: 'none',
    },
  },
  tabsRoot: {
    backgroundColor: theme.palette.custom.white,
  },
  tabRoot: {
    [theme.breakpoints.up('xs')]: {
      minWidth: '4rem',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '5rem',
    },
    [theme.breakpoints.up('md')]: {
      minWidth: '5rem',
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: '7rem',
    },
  },
  tabTextColorInherit: {
    color: theme.palette.primary.main,
  },
}));

const tabList = [
  {
    label: '홈',
    route: 'home',
  },
  {
    label: '대화',
    route: 'chat',
  },
  {
    label: '피드',
    route: 'feed',
  },
];

const CustomAppTabBar = () => {
  const { page } = useParams();
  const classes = useStyles();
  const history = useHistory();
  // 전달 받은 page에 맞게 tab 하이라이트
  const getValue = () => {
    let value = 0;
    tabList.forEach((tab, idx) => {
      if (tab.route === page) {
        value = idx;
      }
    });
    return value;
  };
  const [value, setValue] = useState(getValue());
  const onChangeTab = (e, newValue) => {
    setValue(newValue);
  };
  const onClickTab = (tab) => {
    history.push(`/${tab.route}`);
  };
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Tabs
          value={value}
          onChange={onChangeTab}
          classes={{ root: classes.tabsRoot }}
          indicatorColor='primary'
          variant='scrollable'
          scrollButtons='auto'
        >
          {tabList.map((tab, idx) => (
            <Tab
              classes={{
                root: classes.tabRoot,
                textColorInherit: classes.tabTextColorInherit,
              }}
              label={tab.label}
              key={idx}
              onClick={() => {
                onClickTab(tab);
              }}
            />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default memo(CustomAppTabBar);
