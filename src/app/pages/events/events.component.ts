import { Component, OnInit, OnDestroy } from '@angular/core';
import axios from 'axios';
import * as Highcharts from 'highcharts';
import * as HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { faCheck, faExclamationTriangle, faUserCircle, faSpinner, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit {
  // ICONOS UTILIZADOS
  public faCheck = faCheck;
  public faRedoAlt = faRedoAlt;
  public faSpinner = faSpinner;
  public faUserCircle = faUserCircle;
  public faExclamationTriangle = faExclamationTriangle;

  // CONFIGURACION DE GRAFICA
  public Highcharts = Highcharts;

  // DECLARACION DE VARIABLES-CONTENEDORES
  public devices = []
  public dataChartPower = {};

  // VARIABLES PARA WEBSOCKETS
  ws : WebSocketSubject<any>;
  public statusContainer = {}
  p = 1; // PAGINACIÓN

  public userData = {}
  ngOnInit(): void {
    // Validación de que el usuario haya iniciado sesión para otorgarle acceso a la pagina
    if(localStorage.getItem('timining-user') == undefined){
      this.router.navigate(['/login']);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'You must authenticate to enter'
      })
    }else{
      this.getDevices();
      this.getPower();
      this.userData = JSON.parse(localStorage.getItem('timining-user'));  
    }
  }

  constructor(public router: Router) {
    // PETICION PARA OBTENER WEBSOCKETS
    const self = this;
    this.ws = webSocket({
      url: 'wss://frontend-excercise.dt.timlabtesting.com/eventstream/connect',
      deserializer: e => e.data
    });
    this.ws.subscribe({
      next : function(data){
        const status = data.split('|');
        if(self.statusContainer[status[0]] == undefined){
          self.statusContainer[status[0]] = [{nombre:status[0], status: status[1], date: new Date()}];
        }else{
          self.statusContainer[status[0]].unshift({nombre:status[0], status: status[1], date: new Date()});
        }
      },
      error : (err) => {},
      complete : () => {}
    });
  }

  // FUNCION PARA FORMATEAR COLOR DE ICONOS
  formatIcons(status){
    if(status == 'OK'){
      return 'text-center text-green fs-icons-c'
    }else{
      return 'text-center text-red fs-icons-c'
    }
  }

  formatDate(fecha){
    const formatFecha = moment(fecha);
    return formatFecha.format("DD-MM-YYYY h:mm:ss")
  }

  // FUNCION PARA OBTENER DISPOSITIVOS DISPONIBLES
  public loadingDevices = false;
  public errorDevices = false;
  getDevices(){
    const self = this;
    self.devices = [];
    self.loadingDevices = true;
    self.errorDevices = false;
    axios({
      method: 'get',
      url: 'https://frontend-excercise.dt.timlabtesting.com/ops/device/list',
      timeout:30000,
    }).then(function(response){
      self.errorDevices = false;
      self.loadingDevices = false;
      let ix;
      for(ix = 0; ix < response.data.devices.length; ix++){
        self.devices.push({nombre:response.data.devices[ix], status: false})
      }
    }).catch(function(error){
      self.errorDevices = true;
      self.loadingDevices = false;
    })
  }

  // FUNCION PARA OBTENER RENDIMIENTO DE EQUIPOS
  public processedData = [];
  public loadingPower = false;
  public errorPower = false;
  getPower(){
    const self = this;
    this.loadingPower = true;
    this.errorPower = false;
    axios({
      method: 'get',
      url: 'https://frontend-excercise.dt.timlabtesting.com/ops/device/performance',
      timeout:30000,
    }).then(function(response){
      self.loadingPower = false;
      self.errorPower = false;
      if(response.data.values.length > 0){
        let contador;
        self.processedData = [];
        for(contador = 0; contador < response.data.values.length; contador++){
          self.processedData.push({
            name: response.data.devices[contador],
            data: [response.data.values[contador]*100],
            type: 'column'
          })
          console.log(self.processedData)
          if(contador == (response.data.values.length-1)){
            self.dataChartPower = {
              chart: {
                style:{
                  fontFamily: 'Arial'
                },
              },
              xAxis: {
                categories:[],
              },
              legend: {
                enabled: true,
                style:{
                  fontSize:"15px"
                }
                
              },
              tooltip:{
                formatter: function () {
                  return '<span style="color:'+this.series.color+'; font-size:15px">●</span> '+this.series.name+'<b>' + this.x +
                '</b>: <b>' + Math.round(this.y) + '%</b>';
/*                  return this.points.reduce(function (s, point) {
                      return s + '<br/><span style="color:'+point.series.color+'; font-size:15px">●</span> ' + point.series.name + ': <b>' +
                          point.y+'% </b>'
                  },
                  '<div style="text-align:center; color: black; font-family: "Mada", sans-serif"><b>' + this.x +' </b></div>'); */
                },
              },
              yAxis:{
                max:100,
                title:{
                  enabled:false
                },
                labels:{
                  style:{
                    fontSize:"15px"
                  },
                  formatter:
                    function() {
                      return this.value+'%';
                  }
                }
              },
              title:{
                text:''
              },
              credits:{
                enabled:false,
              },
              series: self.processedData,
            }
          }
        }
      }
    }).catch(function(error){
      self.errorPower = true;
      self.loadingPower = false;
    })
  }

}
