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

import { WalletButton } from 'dattt/components/wallet';

export default function Home() {
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
                    label="Tweet"
                    variant="outlined"
                    // @ts-ignore
                    color="contrast"
                    multiline
                    minRows={2}
                    maxRows={10}
                    sx={{width: '100%'}}
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button variant="contained" sx={{ml:'auto'}}>Tweet</Button>
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
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button variant="contained" sx={{ml:'auto'}}>Retweet</Button>
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
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button variant="contained" sx={{ml:'auto'}}>Follow</Button>
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
                  />
                </Grid>
                <Grid item sx={{display:'flex', alignItems: 'center', marginLeft: '1em'}}>
                  <Button variant="contained" sx={{ml:'auto'}}>UnFollow</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
