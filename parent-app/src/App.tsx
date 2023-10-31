import { Col, Row, Typography } from 'antd';
import React, { useCallback, useEffect } from 'react';

const { Title } = Typography;

export default function App() {
  const fakeFormPath =
  'http://data-v3-dev.vbpo-st.com:9400/dop/DOP/DOP_FORM/BPM_PROCESS/17/USER_TASK_FORM/10/index.html';
  const STATISTIC_FORM_HOST='http://data-v3-dev.vbpo-st.com:9400';

  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log('[Parent] Received message from iframe: ', event.data);
    });

    // const iframe = document.getElementById(
    //   'dop_embedded_external_form_dev'
    // ) as HTMLIFrameElement;
    // if (iframe && iframe.contentWindow) {
    //   iframe.contentWindow.addEventListener('message', (event) => {
    //     console.log('AAAAA event.data',  event.data);

    //     if (event.origin === STATISTIC_FORM_HOST) {
    //       console.log('[Parent] Received message from iframe:', event.data);
    //     }
    //   });
    // }
  }, []);

  const sendMessageToIframe = useCallback((message: unknown) => {
    const iframe = document.getElementById(
      'dop_embedded_external_form_dev'
    ) as HTMLIFrameElement;
    const embeddedForm = iframe?.contentWindow;

    if (embeddedForm) {
      embeddedForm.postMessage(message, STATISTIC_FORM_HOST);
    }
  }, []);

  const handleSendDataToChild = useCallback(() => {
    sendMessageToIframe({
      firstName: 'Trung',
      lastName: 'Tran',
    });
  }, [sendMessageToIframe]);

  return (
    <Row gutter={16}>
      <Col span={20} offset={2}>
        <Title level={4}>Parent app</Title>
        
        {/* <iframe src="http://127.0.0.1:50023/dist/index.html" width="100%" height={500} frameBorder="0" /> */}
        <iframe
          title='Dop External Form'
          id="dop_embedded_external_form_dev"
          src={fakeFormPath}
          width="100%"
          height={500}
          frameBorder="0"
        />
      </Col>
    </Row>
  );
}
