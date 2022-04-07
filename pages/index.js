import React, { useState } from "react";
import ACard from "../components/organisms/ACard";
import Layout from "../components/templates/layout";
import Connector from "../components/templates/Connector";


export default function Home() {
  const [connectedData, setConnectedData] = useState({address: null, balance: null});
  const [submittedQuestions, setSubmittedQuestions] = useState();

  const styles = {
      balance : {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
      },
      noMargin: {
          margin: 0
      }
  };

  return (

    <Layout currentAddress={connectedData && connectedData.address}>

      {connectedData && connectedData.address &&
          <>
            <ACard>
                <div style={styles.balance}>
                    <h1 style={styles.noMargin}>
                        {connectedData.balance}
                    </h1>
                    <p style={styles.noMargin}>
                        $QUIZ balance
                    </p>
                </div>
            </ACard>
            {submittedQuestions &&
                <ACard
                    title={'✅'}
                    label={'You have successfully submitted your answers and earned some $QUIZ tokens.'}
                    hint={{text: 'Come back tomorrow to receive a new survey.'}}
                />
            }
          </>
      }
      <Connector handleConnectedData={setConnectedData}
                 handleSubmittedQuestions={setSubmittedQuestions}
      />
    </Layout>

  )
}
