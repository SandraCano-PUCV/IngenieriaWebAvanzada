import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Productos } from './productos';
import {Products} from '../../services/products';

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;

  const productosMock = [
    {
      id: 1,
      nombre: 'Notebook',
      descripcion: 'Notebook de prueba',
      precio: 500000,
      stock: 5
    }
  ];

  const productosServiceMock = {
    obtenerProductos: vi.fn().mockReturnValue(
      of(productosMock)
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productos],
      providers: [
        {
          provide: Products,
          useValue: productosServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
