import styled from 'styled-components';

export const LayoutContainer = styled.div`
  height: calc(100% - 64px);
  box-sizing: border-box;
  width: 100%;
  background: #222222;
  display: flex;
  justify-content: center;
  padding-top: 30px;
`;

export const Footer = styled.div`
  padding-top: 24px;
  bottom: 0;
  margin-bottom: 24px;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0px;
`;

export const MainContainer = styled.main`
  box-sizing: border-box;
  padding: ${props => (props.loading === 'true' ? '0' : props.padding)};
  background: #333333;
  min-height: ${props => props.minHeight || '550px'};
  max-height: ${props => props.maxHeight || '70%'};
  border-radius: 14px;
  height: ${props => props.height || 'initial'};
  position: relative;
  overflow: hidden;

  &:hover {
    overflow-y: scroll;
    overflow: overlay;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background: #636366;
  }

  .layout-button {
    border-radius: 2px;
    background-color: var(--gb-green);
    font-size: 14px;
  }

  .layout-back-icon {
    cursor: pointer;
    position: absolute;
    top: 24px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

MainContainer.defaultProps = {
  padding: '56px 48px 20px 48px',
  height: 'fit-content',
  minHeight: '550px',
  maxHeight: '70%',
};

export const LoadingOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--gb-dark-grey);
  z-index: 30;
`;
