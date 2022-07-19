import Head from "next/head";
import React from "react";

export default class Layout extends React.Component {
    render() {
        return (
            <>
                <Head>
                    <title>{this.props.title}</title>
                    {/*<script src="https://cdn.jsdelivr.net/npm/swiffy-slider@1.5.3/dist/js/swiffy-slider.min.js"*/}
                    {/*        crossOrigin="anonymous" defer></script>*/}
                    {/*<link href="https://cdn.jsdelivr.net/npm/swiffy-slider@1.5.3/dist/css/swiffy-slider.min.css"*/}
                    {/*      rel="stylesheet" crossOrigin="anonymous"/>*/}
                </Head>
                {this.props.children}
            </>
        )
    }
}