// @vitest-environment happy-dom
// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {flushPromises, mount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {api, loadByTagName} from '@wippy-fe/proxy'
import Onboarding from './Onboarding.vue'

vi.mock('@wippy-fe/proxy', () => ({api:{get:vi.fn()},loadByTagName:vi.fn()}))
vi.mock('@wippy-fe/webcomponent-vue', () => ({useEvents:()=>vi.fn()}))
vi.mock('@iconify/vue', () => ({Icon:{template:'<span />'}}))
vi.mock('primevue/button', () => ({
  default:{props:['label'],template:'<button>{{ label }}</button>'},
}))

const modelSetupPath = '/api/v1/models/admin'
const noClasses = {status:200,data:{success:true,classes:[]}}

function modelDiscovery(canManage?:boolean) {
  vi.mocked(api.get).mockImplementation(async (path:string) => {
    if (path.endsWith('/classes')) return noClasses
    if (path === '/api/v1/models/list?capability=generate') return {status:200,data:{
      success:true,models:[],...(canManage === undefined ? {} : {can_manage_models:canManage}),
    }}
    throw new Error('Unexpected request')
  })
}

function modelSetupWasRequested() {
  return vi.mocked(api.get).mock.calls.some(([path]:[string, ...unknown[]]) => path === modelSetupPath)
}

describe('model setup in first-agent onboarding', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('hands off to an administrator when the signed-in user is denied model setup', async () => {
    modelDiscovery(false)
    const wrapper = mount(Onboarding)
    await flushPromises()

    expect(wrapper.get('h2').text()).toBe('A model is required')
    expect(wrapper.text()).toContain('A workspace administrator can set one up under System → Models.')
    expect(wrapper.findAll('button').map(button => button.text())).toEqual(['Close'])
    expect(modelSetupWasRequested()).toBe(false)
    expect(loadByTagName).not.toHaveBeenCalledWith('kickside-onboard-models', expect.anything())
    wrapper.unmount()
  })

  it('offers the model setup wizard to a caller with Models access', async () => {
    modelDiscovery(true)
    const wrapper = mount(Onboarding)
    await flushPromises()

    expect(wrapper.get('h2').text()).toBe('Set up a model')
    const setupButton = wrapper.findAll('button').find(button => button.text() === 'Set up a model')
    expect(setupButton).toBeDefined()
    await setupButton?.trigger('click')
    await flushPromises()
    expect(loadByTagName).toHaveBeenCalledWith('kickside-onboard-models', expect.anything())
    expect(wrapper.find('kickside-onboard-models').exists()).toBe(true)
    wrapper.unmount()
  })

  it('keeps a System settings path on a host with older Models discovery', async () => {
    modelDiscovery()
    const wrapper = mount(Onboarding)
    await flushPromises()

    expect(wrapper.get('h2').text()).toBe('A model is required')
    expect(wrapper.text()).toContain('System → Models')
    expect(wrapper.findAll('button').map(button => button.text())).toEqual(['Close'])
    expect(modelSetupWasRequested()).toBe(false)
    wrapper.unmount()
  })

  it('allows retrying failed model discovery', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Could not load the model catalog'))
    const wrapper = mount(Onboarding)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Could not load the model catalog')
    modelDiscovery(true)
    const retry = wrapper.findAll('button').find(button => button.text() === 'Retry')
    expect(retry).toBeDefined()
    await retry?.trigger('click')
    await flushPromises()
    expect(wrapper.get('h2').text()).toBe('Set up a model')
    wrapper.unmount()
  })

  it('does not read the Models admin endpoint when a generation model is available', async () => {
    vi.mocked(api.get).mockImplementation(async (path:string) => path.endsWith('/classes') ? noClasses : ({
      status:200,data:{success:true,models:[{name:'available-model'}]},
    }))
    const wrapper = mount(Onboarding)
    await flushPromises()

    expect(wrapper.get('h2').text()).toBe('Create your first agent')
    expect(modelSetupWasRequested()).toBe(false)
    wrapper.unmount()
  })
})
