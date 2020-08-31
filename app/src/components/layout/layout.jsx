import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Loader from '../icons/Loader';
import Back from '../icons/Back';
import {
  Title, Flex, Button, Text,
} from '../styles';
import {
  Footer, MainContainer, LayoutContainer, LoadingOverlay,
} from './style';

const Layout = ({
  children, title, loading, nav, padding, buttonText,
  buttonAction, backAction, back, height, withFooter, minHeight, maxHeight,
}) => {
  const { goBack } = useHistory();

  const backTrigger = backAction || goBack;

  return (
    <LayoutContainer>
      {nav}
      <MainContainer
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        padding={padding || '26px 48px 20px 48px'}
        loading={loading.toString()}
      >
        {
          loading && (
            <LoadingOverlay>
              <Loader />
            </LoadingOverlay>
          )
        }
        {
          back && (
            <div className="layout-back-icon" role="presentation" onClick={backTrigger}>
              <Back />
              <Text
                cursor="pointer"
                color="#ffffff"
                size="14px"
                margin="0 0 0 4px"
              >
                {' Back'}
              </Text>
            </div>
          )
        }
        <Fragment>
          <Flex>
            <Title align="center" width="100%">{title}</Title>
            {Boolean(buttonText) && (
              <Button
                className="green layout-button"
                width="126px"
                height="24px"
                onClick={buttonAction}
              >
                {buttonText}
              </Button>
            )}
          </Flex>
          <>
            {children}
            {withFooter
              && (
                <Footer>
                  <Text size="14px" align="center">
                    Girbil is made with
                  <span role="img" aria-label="love">
                      {' ❤️ '}
                    </span>
                  around the world by a remote team.
                </Text>
                </Footer>
              )
            }
          </>
        </Fragment>
      </MainContainer>
    </LayoutContainer>
  );
};

Layout.defaultProps = {
  height: 'fit-content',
  loading: false,
  nav: null,
  padding: '26px 48px 20px 48px',
  buttonText: '',
  buttonAction: () => { },
  backAction: null,
  back: false,
  withFooter: false,
  minHeight: '550px',
  maxHeight: '70%',
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  back: PropTypes.bool,
  nav: PropTypes.element,
  padding: PropTypes.string,
  height: PropTypes.string,
  buttonText: PropTypes.string,
  buttonAction: PropTypes.func,
  withFooter: PropTypes.bool,
  minHeight: PropTypes.string,
  maxHeight: PropTypes.string,
  backAction: PropTypes.oneOfType([PropTypes.func, () => null]),
};

export default Layout;
