import styled from 'styled-components'

export const Camera = styled.div`
  height: 400px;
  background: radial-gradient(black, transparent);
  color: #ffffff;
  font: bold 18px/24px 'Source sans pro';
  text-align: center;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
`

export const Video = styled.video`
  height: 400px;
  width: 300px;
  object-fit: cover;
`

export const Canvas = styled.canvas`
  height: 400px;
  width: 300px;
  object-fit: cover;
`

export const Wrapper = styled.div`
  width: 300px;
  margin: 10px;
`

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Error = styled.p`
  display: ${(props) => props.display};
  text-align: center;
  font: bold 14px/20px 'Source sans pro';
`
