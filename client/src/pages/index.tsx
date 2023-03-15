import { useState } from 'react';
import Head from 'next/head'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { WalletButton } from 'dattt/components/wallet';
import { signMemo } from 'dattt/utils/sol';
import { submitTask } from 'dattt/api/tasks';
import { capitalizeText } from 'dattt/utils/text';


const defaultFormState = {
  submitting: false,
  tweetText: '',
  retweetUrl: '',
  retweetQuote: '',
  followUser: '',
  unfollowUser: ''
};


export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const publicKey = wallet.publicKey && wallet.publicKey.toBase58();

  const [forms, setForms] = useState(defaultFormState);
  const { tweetText, retweetUrl, retweetQuote, followUser, unfollowUser, submitting } = forms;

  const attemptSubmitTask = async (messageData: any) => {
    if (!publicKey || submitting) return;
    setForms({...forms, submitting: true});

    const memoResp = await toast.promise(
      signMemo(connection, wallet, JSON.stringify(messageData)),
      {
        pending: 'Waiting for finalized transaction',
      });
    if (memoResp?.signature && memoResp?.memoHash) {
      const taskLabel = capitalizeText(messageData?.action);
      const taskResp = await toast.promise(
        submitTask(publicKey,  memoResp.signature, messageData, memoResp.memoHash),
        {
          pending: `${taskLabel}ing...`
        }
      );

      // clear related field after submission
      let updatedForms = JSON.parse(JSON.stringify(forms)); // deep copy
      updatedForms.submitting = false;
      if (taskResp.success) {
        toast.success(`${taskLabel} successful`);
        if (messageData.action === 'tweet') updatedForms.tweetText = '';
        if (messageData.action === 'retweet') updatedForms.retweetUrl = '';
        if (messageData.action === 'quotetweet') {
          updatedForms.retweetUrl = '';
          updatedForms.retweetQuote = '';
        }
        if (messageData.action === 'follow') updatedForms.followUser = '';
        if (messageData.action === 'unfollow') updatedForms.unfollowUser = '';
      }

      setForms(updatedForms);
      console.log("Task Response", taskResp);
    } else if (memoResp?.error) {
      // @ts-ignore
      toast.error(memoResp?.error?.message);
      setForms({...forms, submitting: false});
    }
  }

  return (
    <>
      <Head>
        <title>DATTT</title>
        <meta name="description" content="Decentralized autonomous task manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h4" sx={{ letterSpacing: -1, flexGrow: 1, fontWeight: 800 }}>
              DATTT
            </Typography>
            <span >
              <WalletButton />
            </span>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="sm">
        <Grid container direction="column" spacing={2} sx={{mt:2}}>
          <Grid item>
            <Card sx={{p:2}}>
            <Grid container spacing={0} direction={'column'}>
                <Grid item sx={{pb:2}}>
                  <TextField
                    label="Tweet Text"
                    variant="outlined"
                    // @ts-ignore
                    color="contrast"
                    multiline
                    minRows={2}
                    maxRows={10}
                    sx={{width: '100%'}}
                    value={tweetText}
                    onChange={(evt) => {
                      setForms({
                        ...forms,
                        tweetText: evt.target.value
                      });
                    }}
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button
                    variant="contained"
                    sx={{ml:'auto'}}
                    disabled={submitting || !publicKey || !tweetText}
                    onClick={() => {
                      const messageData = {
                        module: 'twitter',
                        action: 'tweet',
                        timestamp: Date.now(),
                        data: tweetText,
                      };
                      attemptSubmitTask(messageData);
                    }}
                  >Tweet</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{p:2}}>
              <Grid container spacing={0} direction={'column'}>
                <Grid item sx={{pb:2}}>
                  <TextField
                    label="Tweet Link"
                    variant="outlined"
                    // @ts-ignore
                    color="contrast"
                    sx={{width: '100%'}}
                    value={retweetUrl}
                    onChange={(evt) => {
                      setForms({
                        ...forms,
                        retweetUrl: evt.target.value
                      });
                    }}
                  />
                </Grid>
                <Grid item sx={{pb:2}}>
                  <TextField
                    label="Quote (Optional)"
                    variant="outlined"
                    // @ts-ignore
                    color="contrast"
                    multiline
                    minRows={2}
                    maxRows={10}
                    sx={{width: '100%'}}
                    value={retweetQuote}
                    onChange={(evt) => {
                      setForms({
                        ...forms,
                        retweetQuote: evt.target.value
                      });
                    }}
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button
                    variant="contained"
                    sx={{ml:'auto'}}
                    disabled={submitting || !publicKey || !retweetUrl}
                    onClick={() => {
                      let messageData = {
                        module: 'twitter',
                        action: '',
                        timestamp: Date.now(),
                        data: ''
                      };
                      if (retweetQuote) {
                        messageData.action = 'quotetweet';
                        messageData.data = `${retweetQuote} ${retweetUrl}`;
                      } else {
                        messageData.action = 'retweet';
                        messageData.data = `${retweetUrl}`;
                      }
                      attemptSubmitTask(messageData);
                    }}
                  >Retweet</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{p:2, mb:2}}>
              <Grid container spacing={0}>
                <Grid item sx={{flexGrow: 1}}>
                  <TextField
                    label="User"
                    variant="outlined"
                    // @ts-ignore
                    color="contrast"
                    sx={{width: '100%'}}
                    value={followUser}
                    onChange={(evt) => {
                      setForms({
                        ...forms,
                        followUser: evt.target.value
                      });
                    }}
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button
                    variant="contained"
                    sx={{ml:'auto'}}
                    disabled={submitting || !publicKey || !followUser}
                    onClick={() => {
                      const messageData = {
                        module: 'twitter',
                        action: 'follow',
                        timestamp: Date.now(),
                        data: followUser,
                      };
                      attemptSubmitTask(messageData);
                    }}
                  >Follow</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{p:2, mb:2}}>
              <Grid container spacing={0}>
                <Grid item sx={{flexGrow: 1}}>
                  <TextField
                    label="User"
                    variant="outlined"
                    // @ts-ignore
                    color="contrast"
                    sx={{width: '100%'}}
                    value={unfollowUser}
                    onChange={(evt) => {
                      setForms({
                        ...forms,
                        unfollowUser: evt.target.value
                      });
                     }}
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button
                    variant="contained"
                    sx={{ml:'auto'}}
                    disabled={submitting || !publicKey || !unfollowUser}
                    onClick={() => {
                      const messageData = {
                        module: 'twitter',
                        action: 'unfollow',
                        timestamp: Date.now(),
                        data: unfollowUser,
                      };
                      attemptSubmitTask(messageData);
                    }}
                  >UnFollow</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
