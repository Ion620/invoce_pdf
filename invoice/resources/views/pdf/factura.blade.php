<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Factura {{ $factura->numar_factura }}</title>
    <style>
        @page {
            margin: 1cm;
            size: A4 portrait;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
            line-height: 1.2;
        }
        .container {
            width: 100%;
        }
        .header-row {
            width: 100%;
            clear: both;
            overflow: hidden;
            margin-bottom: 5px;
        }
        .header-left {
            float: left;
            width: 48%;
        }
        .header-right {
            float: right;
            width: 48%;
        }
        .title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }
        .invoice-box {
            border: 1px solid #000;
            width: 250px;
            padding: 5px;
            margin: 0 auto 10px auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th, td {
            padding: 3px;
            font-size: 9px;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        .line {
            margin-bottom: 2px;
        }
        .footer-cell {
            vertical-align: top;
            font-size: 9px;
            line-height: 1.1;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header-row clearfix">
        <div class="header-left">
            <div class="line">Furnizor {{ auth()->user()->name ?? 'YE FlowerPower SRL' }}</div>
            <div class="line">Nr.O.N.R.C {{ config('company.reg_number') }}</div>
            <div class="line">C.U.I {{ config('company.vat_number') }}</div>
            <div class="line">Sediul {{ config('company.address') }}<br></div>
            <div class="line">Judetul {{ config('company.county') }}</div>
            <div class="line">Capital social {{ $factura->furnizor_capital ?? '800 000' }}</div>
            <div class="line">Cod IBAN {{ config('company.bank_account') }}</div>
            <div class="line">Banca {{ config('company.bank') }}</div>
        </div>
        <div class="header-right">
            <div class="line">Cumparator {{ $factura->client->nume ?? 'YE BANCA FSE' }}</div>
            <div class="line">Nr.ord.reg.com/an {{ $factura->client->nr_onrc ?? 'J15/231/2013' }}</div>
            <div class="line">C.I.F {{ $factura->client->cui ?? 'RO22001' }}</div>
            <div class="line">Sediul {{ $factura->client->sediul ?? 'Targoviste .str. Lt Stancu Ion, nr 35' }}</div>
            <div class="line">Judetul {{ $factura->client->judetul ?? 'Dambovita' }}</div>
            <div class="line">Cod IBAN {{ $factura->client->cod_iban ?? 'RO17YEB00000001' }}</div>
            <div class="line">Banca {{ $factura->client->banca ?? 'YE Banca FSE' }}</div>
        </div>
    </div>

    <div class="title">FACTURA FISCALA</div>

    <div class="invoice-box">
        <div class="line">Nr. Facturii {{ $factura->numar_factura }}</div>
        <div class="line">Data (ziua, luna, anul) {{ date('d.m.Y', strtotime($factura->data_factura)) }}</div>
        @if($factura->are_aviz)
            <div class="line">Aviz de însoțire a mărfii...............</div>
            <div class="line">(daca este cazul)</div>
        @endif
    </div>

    <table>
        <tr>
            <th style="text-align: center;">Nr crt</th>
            <th style="text-align: center;">Denumirea produselor si serviciilor</th>
            <th style="text-align: center;">U.M.</th>
            <th style="text-align: center;">Cantitatea</th>
            <th style="text-align: center;">Pretul unitar<br>(fara T.V.A)<br>-lei-</th>
            <th style="text-align: center;">Valoarea<br>-lei-</th>
            <th style="text-align: center;">Valoare<br>T.V.A<br>-lei-</th>
        </tr>
        <tr>
            <td style="text-align: center;">0</td>
            <td style="text-align: center;">1</td>
            <td style="text-align: center;">2</td>
            <td style="text-align: center;">3</td>
            <td style="text-align: center;">4</td>
            <td style="text-align: center;">5(3x4)</td>
            <td style="text-align: center;">6</td>
        </tr>

        @foreach($factura->details as $index => $detaliu)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $detaliu->denumire }}</td>
                <td style="text-align: center;">{{ $detaliu->unitate_masura }}</td>
                <td style="text-align: center;">{{ number_format($detaliu->cantitate, 0) }}</td>
                <td style="text-align: right;">{{ number_format($detaliu->pret_unitar, 2) }}</td>
                <td style="text-align: right;">{{ number_format($detaliu->valoare, 0) }}</td>
                <td style="text-align: right;">{{ number_format($detaliu->valoare_tva, 0) }}</td>
            </tr>
        @endforeach

        @php
            $fillerRows = max(1, min(4, 6 - count($factura->details)));
        @endphp

        @for($i = 0; $i < $fillerRows; $i++)
            <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
        @endfor

        <!-- Rândul pentru subsol - parte din același tabel -->
        <tr>
            <td colspan="2" rowspan="2" class="footer-cell" style="border-right: 1px solid #000; padding: 5px;">
                <div style="margin-bottom: 5px;">Semnataura si stampila</div>
                <div>furnizorului</div>
            </td>
            <td colspan="2" rowspan="2" class="footer-cell" style="border-right: 1px solid #000; padding: 5px;">
                <div style="margin-bottom: 2px;">Date privind expeditia:</div>
                <div>Numele delegatului {{ $factura->delegat ?? 'Pulbere Roxana' }}</div>
                <div>Buletin/cartea de identitate CI</div>
                <div>Seria {{ $factura->seria_bi ?? 'DD' }} Nr {{ $factura->numar_bi ?? '452565' }}</div>
                <div>Eliberat {{ $factura->eliberat_de ?? 'SPCLEP Targoviste' }}</div>
                <div>Mijloc de transport...........nr...............</div>
                <div>Expeditia s-a efectuat in prezenta</div>
                <div>noastra la data de</div>
                <div>{{ date('d.m.Y', strtotime($factura->data_factura)) }}........ora....{{ $factura->ora_expeditie ?? '15.00' }}........</div>
                <div>Semnatura.....................................</div>
            </td>
            <td>Total, din care: accize</td>
            <td colspan="1">{{ number_format($factura->total_fara_tva, 0) }}</td>
            <td colspan="1">{{ number_format($factura->total_tva, 0) }}</td>
        </tr>
        <tr>
            <td class="black-bg">Semnatura de primire</td>
            <td colspan="2" class="black-bg">Total de plata (col. 5+col.6) <br> {{ number_format($factura->total_cu_tva, 0) }} lei</td>
        </tr>
    </table>
</div>
</body>
</html>
