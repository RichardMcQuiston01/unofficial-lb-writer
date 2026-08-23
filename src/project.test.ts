import { describe, expect, it } from 'vitest';
import { createLbrn2Project } from './project';
import { IDENTITY } from './matrix';

describe('createLbrn2Project', () => {
  it('produces an empty project envelope', () => {
    const xml = createLbrn2Project().toXml();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<LightBurnProject');
    expect(xml).toContain('</LightBurnProject>');
  });

  it('assigns CutSetting indices in call order', () => {
    const project = createLbrn2Project();
    const cutIndex = project.addCutSetting({
      name: 'Engrave',
      type: 'Scan',
      maxPower: 50,
      speed: 300,
    });
    const secondIndex = project.addCutSetting({
      name: 'Cut',
      type: 'Cut',
      maxPower: 80,
      speed: 10,
    });
    expect(cutIndex).toBe(0);
    expect(secondIndex).toBe(1);
    const xml = project.toXml();
    expect(xml).toContain('<CutSetting type="Scan">');
    expect(xml).toContain('<CutSetting type="Cut">');
    expect(xml).toContain('<name Value="Engrave"/>');
    expect(xml).toContain('<name Value="Cut"/>');
  });

  it('adds an image CutSetting with defaults', () => {
    const project = createLbrn2Project();
    const index = project.addImageCutSetting();
    expect(index).toBe(0);
    const xml = project.toXml();
    expect(xml).toContain('<CutSetting_Img type="Image">\n<index Value="0"/>');
    expect(xml).toContain('<name Value="Image"/>');
    expect(xml).toContain('<maxPower Value="20"/>');
    expect(xml).toContain('<speed Value="100"/>');
    expect(xml).toContain('<ditherMode Value="stucki"/>');
  });

  it('adds shapes referencing their cut index', () => {
    const project = createLbrn2Project();
    const cutIndex = project.addCutSetting({
      name: 'Cut',
      type: 'Cut',
      maxPower: 20,
      speed: 100,
    });
    project.addRect(cutIndex, IDENTITY, 20, 10, 0);
    const xml = project.toXml();
    expect(xml).toContain('<Shape Type="Rect" CutIndex="0" W="20" H="10" Cr="0">');
  });

  it('places shapes after cut settings', () => {
    const project = createLbrn2Project();
    const cutIndex = project.addCutSetting({
      name: 'Cut',
      type: 'Cut',
      maxPower: 20,
      speed: 100,
    });
    project.addEllipse(cutIndex, IDENTITY, 10, 5);
    const xml = project.toXml();
    expect(xml.indexOf('<CutSetting')).toBeLessThan(xml.indexOf('<Shape'));
  });
});
