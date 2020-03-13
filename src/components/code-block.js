import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import styled from '@emotion/styled';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import {Button} from './buttons';
import {GA_EVENT_CATEGORY_CODE_BLOCK, trackEvent} from '../utils';
import {MultiCodeBlockContext} from './multi-code-block';
import {Select} from './select';
import {colors} from 'gatsby-theme-apollo-core';

const Container = styled.div({
  margin: '0.5em 0 1.45em',
  border: `1px solid ${colors.divider}`,
  borderRadius: 4
});

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: 10,
  borderBottom: `1px solid ${colors.divider}`
});

const StyledSelect = styled(Select)({
  marginRight: 8
});

const InnerContainer = styled.div({
  padding: 15,
  backgroundColor: colors.background,
  overflow: 'auto'
});

export default function CodeBlock(props) {
  const code = useRef();
  const [copied, copyToClipboard] = useCopyToClipboard();

  function handleCopy() {
    copyToClipboard(code.current.innerText);
    trackEvent({
      eventCategory: GA_EVENT_CATEGORY_CODE_BLOCK,
      eventAction: 'copy'
    });
  }

  return (
    <Container>
      <Header>
        <MultiCodeBlockContext.Consumer>
          {({languages, onLanguageChange, activeIndex}) =>
            languages && (
              <StyledSelect
                size="small"
                variant="hidden"
                value={activeIndex}
                onChange={onLanguageChange}
              >
                {languages.map((language, index) => (
                  <option value={index} key={index}>
                    {language}
                  </option>
                ))}
              </StyledSelect>
            )
          }
        </MultiCodeBlockContext.Consumer>
        <Button variant="hidden" size="small" onClick={handleCopy}>
          {copied.value ? 'Copied!' : 'Copy'}
        </Button>
      </Header>
      <InnerContainer>
        <pre className={props.className} ref={code}>
          {props.children}
        </pre>
      </InnerContainer>
    </Container>
  );
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};
